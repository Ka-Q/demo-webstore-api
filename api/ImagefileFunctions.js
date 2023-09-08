require('dotenv').config()
const { AwsClient } = require('aws4fetch')

const aws = new AwsClient({
  accessKeyId: process.env.R2_ACCESSKEY,
  secretAccessKey: process.env.R2_ACCESSKEY_SECRET
})

async function getImageFile(req, res) {
  const filename = req.query.filename;
  if (!filename) {
    res.json({error: "missing filename"})
  }
  else {
    try {
      const response = await aws.fetch(`${process.env.R2_BUCKET_API}/${filename}`)
      if (!response.ok) throw new Error('No such file')
      const fileStream = await response.arrayBuffer();
      res.setHeader('Content-Type', 'image/jpeg');
      res.send(fileStream);
    } catch (err) {
      res.json({error: "No such file"})
    }
  }
}

async function postImageFile(req, res) {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.json({error: 'No files were uploaded.'});
  }
  let file = req.files.file;
  let filename = file.name;
  
  try {
    const response = await aws.fetch(`${process.env.R2_BUCKET_API}/${filename}`, {
      method: 'PUT',
      body: file.data,
      headers: { 'Content-Type': 'application/octet-stream' }
    })
    if (!response.ok) throw new Error('Error uploading file')
    res.json({success: "File uploaded successfully"})
  } catch (err) {
    res.json({error: "Error uploading file"})
  }
}

module.exports = {getImageFile, postImageFile};
