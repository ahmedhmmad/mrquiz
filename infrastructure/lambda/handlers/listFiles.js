const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    try {
        const params = {
            Bucket: process.env.BUCKET_NAME
        };

        const data = await s3.listObjectsV2(params).promise();
        const files = data.Contents.map(file => file.Key);

        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            body: JSON.stringify({ files: files }),
        };
    } catch (error) {
        console.error('Error listing files:', error);
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Allow-Methods": "OPTIONS,GET"
            },
            body: JSON.stringify({ message: "Error listing files" }),
        };
    }
};