const AWS = require('aws-sdk');
const s3 = new AWS.S3();

exports.handler = async (event) => {
    const { fileContent, fileName } = JSON.parse(event.body);

    try {
        // Generate a unique key (file name) for each upload
        const uniqueFileName = generateUniqueFileName(fileName);

        // Upload the file content to the bucket
        const uploadParams = {
            Bucket: process.env.BUCKET_NAME,
            Key: uniqueFileName,
            Body: Buffer.from(fileContent, 'base64'),
            ContentType: 'application/octet-stream', // Set correct content type
        };

        const data = await s3.upload(uploadParams).promise();
        console.log(`File uploaded successfully: ${data.Location}`);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File uploaded successfully' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        };
    } catch (error) {
        console.error('Failed to upload file:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to upload file' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        };
    }
};

function generateUniqueFileName(originalFileName) {
    const timestamp = new Date().getTime();
    const randomString = Math.random().toString(36).substring(2, 15);
    return `${timestamp}_${randomString}_${originalFileName}`;
}
