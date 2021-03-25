const router = require('express').Router()
const aws = require('aws-sdk')
require('../../secrets')
const S3_BUCKET = process.env.S3_BUCKET

aws.config.region = 'us-east-2'

router.get('/s3-sign', async (req, res) => {
  const s3 = new aws.S3()
  console.log('req query', req.query)
  const fileName = req.query['file-name']
  const fileType = req.query['file-type']
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  }
  console.log('signing with s3')
  console.log(s3Params)
  await s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err)
      return res.end()
    }
    const returnData = {
      signedUrl: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    }
    console.log(returnData)
    res.write(JSON.stringify(returnData))
    res.end()
  })
})

module.exports = router
