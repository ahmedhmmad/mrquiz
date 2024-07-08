const aws = require('aws-sdk');
const s3 = new AWS.S3();
const textract = new aws.Textract();

exports.handler = async (event) => {
    const bucketName = process.env.BUCKET_NAME;
    const { filename } = JSON.parse(event.body);

    const params={
        Document:{
            S3Object:{
                Bucket:bucketName,
                Name:filename
            },
        },
        FeatureTypes: ['TABLES', 'FORMS'],
    };
    
    try {
        const data = await textract.analyzeDocument(params).promise();
        console.log(data);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File processed successfully' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        };
    } catch (error) {
        console.error('Failed to process file:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to process file' }),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
        };
    }
}