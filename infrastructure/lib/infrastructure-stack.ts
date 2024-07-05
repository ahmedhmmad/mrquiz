import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

import * as iam from 'aws-cdk-lib/aws-iam';

import { Construct } from 'constructs';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket for storing uploaded files
    const bucket = new s3.Bucket(this, 'uploadedFile', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
    });

    // IAM Role for Lambda to access Textract and S3
    const textExtractRole = new iam.Role(this, 'TextractRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    textExtractRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole'));
    textExtractRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonTextractFullAccess'));
    textExtractRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));

    // Lambda function to extract text from uploaded files
    const extractTextLambda = new lambda.Function(this, 'extractTextFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'processFile.handler',
      code: lambda.Code.fromAsset('lambda'),
      role: textExtractRole,
      environment: {
        BUCKET_NAME: bucket.bucketName, // Ensure the environment variable name matches what the Lambda function expects
      },
    });

    // API Gateway to expose the Lambda function
    const api = new apigateway.RestApi(this, 'extractTextApi', {
      restApiName: 'Quiz Generator Service',
    });

    const uploadIntegration = new apigateway.LambdaIntegration(extractTextLambda);
    api.root.addMethod('POST', uploadIntegration);

    // Grant S3 read permissions to Lambda
    bucket.grantReadWrite(extractTextLambda);

    //Deploy the website
    new s3deploy.BucketDeployment(this, 'deployWebsite', {
      sources: [s3deploy.Source.asset('../web/build')],
      destinationBucket: bucket,
    });
  }
}
