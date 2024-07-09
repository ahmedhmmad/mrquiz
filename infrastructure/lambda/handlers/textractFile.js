const AWS = require('aws-sdk');
const textract = new AWS.Textract();
const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        const { fileName } = JSON.parse(event.body);

        // Get the file from S3
        const s3Params = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileName
        };

        const s3Object = await s3.getObject(s3Params).promise();

        // Use Textract to extract text
        const textractParams = {
            Document: {
                Bytes: s3Object.Body
            }
        };

        const textractData = await textract.detectDocumentText(textractParams).promise();

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            body: JSON.stringify({
                message: "Text extracted successfully",
                textractData: textractData
            }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,POST"
            },
            body: JSON.stringify({
                message: "Error extracting text",
                error: error.message
            }),
        };
    }
};