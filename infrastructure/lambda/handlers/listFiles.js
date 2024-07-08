const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler=async()=>{
    try{
        const data = await s3.listObjects({Bucket: process.env.BUCKET_NAME}).promise();
        const files = data.Contents.map((file) => file.Key);
        return {
            statusCode: 200,
            body: JSON.stringify({ files }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
            },
        };
    } catch (error) {
        console.error('Failed to list files:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to list files' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
            },
        };
    }
}