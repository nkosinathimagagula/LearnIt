import { Construct } from 'constructs';
import { 
  Stack, 
  StackProps,
  RemovalPolicy, 
  aws_s3 as s3,
  aws_iam as iam
} from 'aws-cdk-lib';

export class MyCdkAppStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    
    const bucket = new s3.Bucket(this, 'new-s3-bucket-00', {
      enforceSSL: true,
      minimumTLSVersion: 1.2,
      removalPolicy: RemovalPolicy.DESTROY
    });

    const bucketPolicy = new iam.PolicyStatement({
      actions: ['s3:*'],
      resources: ['*'],
      principals: [new iam.AccountRootPrincipal()]
    });

    const addPolicyResults = bucket.addToResourcePolicy(bucketPolicy);

    if (addPolicyResults.statementAdded) {
      console.log("===============================================================================");
      console.log("policy statement added!");
    } else {
      console.log("===============================================================================");
      console.log("policy statement not added!");
    }

    console.log("bucketName: ", bucket.bucketName);
    console.log("website url: ", bucket.bucketWebsiteUrl); 
    console.log("===============================================================================");
  }
}
