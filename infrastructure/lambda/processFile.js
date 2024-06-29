const AWS = require('aws-sdk');
const s3 = new AWS.S3();
const textract = new AWS.Textract();

exports.handler = async (event) => {
    const bucketName = process.env.BUCKET_NAME;
    const { fileName } = JSON.parse(event.body);

    const params = {
        Document: {
            S3Object: {
                Bucket: bucketName,
                Name: fileName
            }
        },
        FeatureTypes: ["TABLES", "FORMS", "LINES", "WORDS"]
    };

    try {
        const data = await textract.analyzeDocument(params).promise();
        console.log(data);
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File processed successfully', data })
        };
    } catch (err) {
        console.error(err);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Error processing file', error: err.message })
        };
    }
};
