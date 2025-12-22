import { Construct } from 'constructs';
import { 
  Stack, 
  StackProps, 
  RemovalPolicy, 
  aws_iam as iam,
  aws_lambda as lambda,
  aws_dynamodb as dynamodb,
  aws_apigateway as apigateway,
  Duration,
  CfnOutput
} from 'aws-cdk-lib';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class DailyLogStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * IAM Role for Lambda
     */
    const lambdaRole = new iam.Role(this, "DailyLogLambdaRole", {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName("service-role/AWSLambdaBasicExecutionRole"),
      ],
    });

    /**
     * Dynamodb Table Policy for Lambda
     * This policy allows the Lambda function to read and write data to the DynamoDB table
     */
    const dynamodbTablePolicy = new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: [
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:BatchWriteItem",
        "dynamodb:BatchGetItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan",
      ],
      resources: ["*"],
    });

    // Apply removal policy to the role
    // Note: IAM roles cannot be removed in production environments, so this is typically used for development purposes.
    lambdaRole.applyRemovalPolicy(RemovalPolicy.DESTROY);

    // Add policy to allow lambda to read and write to the DynamoDB table.
    lambdaRole.addToPolicy(dynamodbTablePolicy);


    /**
     * DynamoDB Table for Daily Logs 
     */
    const dynamodbTable = new dynamodb.Table(this, "DailyLogTable", {
      tableName: "DailyLogTable",
      partitionKey: {
        name: "name",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: {
        name: "date",
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      tableClass: dynamodb.TableClass.STANDARD,
      removalPolicy: RemovalPolicy.DESTROY,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });


    /**
     * Lambda Function for Daily Log
     */
    const dailyLogLambda = new NodejsFunction(this, "DailyLogLambda", {
      functionName: "DailyLogLambda",
      runtime: lambda.Runtime.NODEJS_LATEST,
      entry: "./src/lambda/main.ts",
      handler: "handler",
      role: lambdaRole,
      environment: {
        TABLE_NAME: dynamodbTable.tableName,
      },
      retryAttempts: 3,
      timeout: Duration.seconds(30),
      memorySize: 128,
      description: "Daily Log Lambda Function",
      reservedConcurrentExecutions: 3,
    });


    /**
     * API Gateway for Daily Log
     */
    const api = new apigateway.RestApi(this, "DailyLogAPI", {
      restApiName: "DailyLogAPI",
      description: "API for daily log entries handled Lambda.",
      deployOptions: {
        stageName: "dev",
        loggingLevel: apigateway.MethodLoggingLevel.INFO,
      },
      // Allow CORS for all origins for now !!
      // TODO: Restrict CORS
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: apigateway.Cors.DEFAULT_HEADERS,
      },
    });

    // Create a lambda integration for the API
    const lambdaIntegration = new apigateway.LambdaIntegration(dailyLogLambda);

    // Define resource and methods for the API
    const dailyLogResource = api.root.addResource("log");

    dailyLogResource.addMethod("GET", lambdaIntegration);


    // Output the API endpoint
    new CfnOutput(this, "APIEndpoint", {
      value: api.url,
      description: 'The URL of the API Gateway endpoint',
    });
  }
}
