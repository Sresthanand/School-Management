require("dotenv").config();
const fs = require("fs");
const aws = require("aws-sdk");

const region = process.env.S3_REGION;
const bucketName = process.env.S3_BUCKET_NAME;
const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKeyId = process.env.AWS_SECRET_ACCESS_KEY_ID;

aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY_ID,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
});

var s3 = new aws.S3();
function uploadFile(file) {
  const uploadParams = {
    Bucket: bucketName,
    Body: file.buffer,
    Key: file.originalname,
    ContentType: file.mimetype,
  };

  return s3.upload(uploadParams).promise();
}

module.exports = uploadFile;
