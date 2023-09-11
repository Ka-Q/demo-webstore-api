require('dotenv').config()
const {AwsClient} = require('aws4fetch');

const AWS = require('aws-sdk');

const R2_URL = process.env.R2_ENDPOINT;

const client = new AwsClient({
  accessKeyId: process.env.R2_ACCESSKEY,
  secretAccessKey: process.env.R2_ACCESSKEY_SECRET,
});

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
        res.json({error: "missing filename"})
    }
    else {
        const params = {
            Bucket: process.env.R2_BUCKET,
            Key: 'default_pfp.png',
          };
          try {
            const data = await s3.getObject(params).promise();
            res.setHeader('Content-Type', 'image/png');
            res.send(data.Body);
          } catch (err) {
            res.status(500).json({ error: err.toString() });
          }
        /*try {
            const ListBucketsResult = await client.fetch(R2_URL);
            console.log(await ListBucketsResult.text());

            const data = await client.fetch(`${R2_URL}/demo-web-store/default_pfp.png`, {method: 'GET'});
            const arrayBuffer = await data.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            res.setHeader('Content-Type', 'image/jpeg');
            res.send(buffer);
        } catch (err) {
            res.json({error: "error"});
        }*/
    }
}

const postImageFile = async (req, res) => {

	let file = req.files.file;

    if (!file) {
        res.json({error: "error"});
    } 
    else {
        /*try {
            await client.fetch(`${process.env.R2_ENDPOINT}/demo-web-store/asdfghjk.png`, {
                method: 'PUT',
                body: file.data
            })
            return res.json({ uploaded: true })
        } catch (err) {
            res.json({error: "error"});
        }*/
    }
	
}


module.exports = {getImageFile, postImageFile};