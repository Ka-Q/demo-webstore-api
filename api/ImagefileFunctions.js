require('dotenv').config()
const { S3Client, GetObjectCommand, PutObjectCommand  } = require("@aws-sdk/client-s3");

const getImageFile = async (req, res) => {
    let filename = req.query.filename;

    const client = new S3Client({
        endpoint: process.env.R2_ENDPOINT ,
        credentials: {
            accessKeyId: process.env.R2_ACCESSKEY,
            secretAccessKey: process.env.R2_ACCESSKEY_SECRET,
            },
        region: process.env.R2_REGION,
    });

    if (!filename) {
        res.json({error: "missing filename"})
    }
    else {
        try {
            const command = new GetObjectCommand({
                Bucket: process.env.R2_BUCKET,
                Key: filename
            });
    
            const data = await client.send(command);
            const fileStream = data.Body;
            res.setHeader('Content-Type', 'image/jpeg');
            fileStream.pipe(res);
        } catch (err) {
            res.json({error: "No such file"})
        }
    } 
}

const postImageFile = async (req, res) => {

    const client = new S3Client({
        endpoint: process.env.R2_ENDPOINT ,
        credentials: {
            accessKeyId: process.env.R2_ACCESSKEY,
            secretAccessKey: process.env.R2_ACCESSKEY_SECRET,
            },
        region: process.env.R2_REGION,
    });
    
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let file = req.files.file;
    let filename = file.name;

    try {
        const command = new PutObjectCommand({
            Bucket: 'demo-web-store',
            Key: filename,
            Body: file.data
        });

        await client.send(command);
        res.json({success: "File uploaded successfully"})
    } catch (err) {
        res.json({error: "Error uploading file"})
    }
}

module.exports = {getImageFile, postImageFile};