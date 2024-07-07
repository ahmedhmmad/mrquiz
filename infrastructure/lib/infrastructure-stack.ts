import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import { Construct } from 'constructs';

export class InfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // S3 Bucket for storing uploaded files
    const bucket = new s3.Bucket(this, 'newUploadedFile', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
     // publicReadAccess: true,
    });

    // IAM Role for Lambda to access Textract and S3
    const textExtractRole = new iam.Role(this, 'TextractRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
    });

    textExtractRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
    );
    textExtractRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonTextractFullAccess'));
    textExtractRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'));

    // Lambda function to extract text from uploaded files
    const extractTextLambda = new lambda.Function(this, 'extractTextFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'processFile.handler',
      code: lambda.Code.fromAsset('lambda'),
      role: textExtractRole,
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    //lambda function to list all the files in the bucket
    const listFilesLambda = new lambda.Function(this, 'listFilesFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'listFiles.handler',
      code: lambda.Code.fromAsset('lambda'),
      role: textExtractRole,
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    //lambda function to get the text from the file
    const textRactLambda = new lambda.Function(this, 'textRactFunction', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'textractFile.handler',
      code: lambda.Code.fromAsset('lambda'),
      role: textExtractRole,
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    // Grant S3 read permissions to Lambda
    bucket.grantReadWrite(extractTextLambda);
    bucket.grantRead(listFilesLambda);
    bucket.grantRead(textRactLambda);

    // API Gateway to expose the Lambda function
    const api = new apigateway.RestApi(this, 'extractTextApi', {
      restApiName: 'Quiz Generator Service',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key', 'X-Amz-Security-Token'],
      },
    });
    
    

    const uploadIntegration = new apigateway.LambdaIntegration(extractTextLambda);
    api.root.addMethod('POST', uploadIntegration);

    
    const listFilesIntegration = new apigateway.LambdaIntegration(listFilesLambda);
    const listFilesResource = api.root.addResource('listFiles');
    listFilesResource.addMethod('GET', listFilesIntegration);

    const textRactIntegration = new apigateway.LambdaIntegration(textRactLambda);
    const textRactResource = api.root.addResource('textRact');
    textRactResource.addMethod('POST', textRactIntegration);


    // Deploy React app to S3 bucket
    new s3deploy.BucketDeployment(this, 'DeployWebsite', {
      sources: [s3deploy.Source.asset('../web/build')],
      destinationBucket: bucket,
    });
  }
}
