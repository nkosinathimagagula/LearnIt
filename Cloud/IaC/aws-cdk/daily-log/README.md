# CDK TypeScript project

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
* `npx cdk destroy` destroy (delete) this stack in AWS

# Serverless Daily Log Backend
This repository contains the backend infrastructure for a daily log application, built using AWS Cloud Development Kit (CDK). It leverages Amazon DynamoDB for data storage, AWS Lambda for logic, and Amazon API Gateway to expose a RESTful API. This project focuses solely on the backend components.


### 🏗️ Architecture
This backend comprises the following AWS services:

Amazon DynamoDB: A NoSQL database table designed to store daily log entries.  
AWS Lambda: Serverless functions that handle API requests (e.g., creating, reading, updating, or deleting log entries) and interact with DynamoDB. The Lambda function code is defined within this project.  
Amazon API Gateway: Provides a RESTful API endpoint that acts as the entry point for interacting with the Lambda functions. It handles request routing and other API management tasks.   

#### 🛠️ Built With
AWS CDK - Infrastructure as Code framework  
TypeScript (or JavaScript, depending on your project) - For CDK code and Lambda functions  
Amazon DynamoDB - NoSQL database  
AWS Lambda - Serverless compute  
Amazon API Gateway - REST API exposure  

