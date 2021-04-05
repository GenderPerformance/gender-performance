const router = require('express').Router()
const aws = require('aws-sdk')

if (
  (process.env.PGHOST === 'localhost' ||
    process.env.NODE_ENV !== 'production') &&
  !process.env.TRAVIS
) {
  require('../../secrets')
}
const S3_BUCKET = process.env.S3_BUCKET

aws.config.region = 'us-east-2'

router.get('/s3-sign', async (req, res) => {
  const s3 = new aws.S3()
  const fileName = req.query['file-name']
  const fileType = req.query['file-type']
  const s3Params = {
    Bucket: S3_BUCKET,
    Key: fileName,
    Expires: 60,
    ContentType: fileType,
    ACL: 'public-read'
  }
  await s3.getSignedUrl('putObject', s3Params, (err, data) => {
    if (err) {
      console.log(err)
      return res.end()
    }
    const returnData = {
      signedUrl: data,
      url: `https://${S3_BUCKET}.s3.amazonaws.com/${fileName}`
    }
    res.write(JSON.stringify(returnData))
    res.end()
  })
})

module.exports = router
