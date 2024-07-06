const AWS = require('aws-sdk');
const S3 = new AWS.S3();

exports.handler = async (event) => {
  try {
    console.log('Event:', JSON.stringify(event, null, 2)); 

    const body = JSON.parse(event.body);
    const { fileContent, fileName } = body;

    if (!fileContent || !fileName) {
      throw new Error('fileContent and fileName are required');
    }

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: fileName,
      Body: Buffer.from(fileContent, 'base64'),
    };

    await S3.putObject(params).promise();

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'File uploaded successfully' }),
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ message: 'Internal server error', error: error.message }),
    };
  }
};
