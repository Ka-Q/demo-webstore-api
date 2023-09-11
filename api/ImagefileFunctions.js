require('dotenv').config()
const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const R2_URL = process.env.R2_ENDPOINT;

const s3 = new AWS.S3({
    endpoint: R2_URL,
    accessKeyId: process.env.R2_ACCESSKEY,
    secretAccessKey: process.env.R2_ACCESSKEY_SECRET,
    signatureVersion: 'v4',
    region: 'auto'
});

const getImageFile = async (req, res) => {
    let filename = req.query.filename;

    if (!filename) {
        res.json({ error: "missing filename" })
    }
    else {
        const params = {
            Bucket: process.env.R2_BUCKET,
            Key: filename,
        };
        try {
            const data = await s3.getObject(params).promise();
            let fileType = data.Metadata['file-type'];
            if (fileType) {
                res.setHeader('Content-Type', `image/${fileType.substring(1)}`);
              } else {
                res.setHeader('Content-Type', 'image/png');
              }
            res.send(data.Body);
        } catch (err) {
            res.status(500).json({ error: "Error getting image" });
        }
    }
}

const postImageFile = async (req, res) => {

    let file = req.files.file;

    if (!file) {
        res.json({ error: "No file provided" });
    } else {
        let ext = path.extname(file.name);
        let uniqueFilename = `${Date.now()}-${uuidv4()}${ext}`;
        
        const params = {
            Bucket: process.env.R2_BUCKET,
            Key: uniqueFilename,
            Body: file.data,
            ACL: 'public-read',
            Metadata: {
                'file-type': path.extname(file.name),
              },
        };

        try {
            await s3.upload(params).promise();
            res.json({ uploaded: true, filename: uniqueFilename  });
        } catch (err) {
            res.status(500).json({ error: "Error uploading image" });
        }
    }
}


module.exports = { getImageFile, postImageFile };