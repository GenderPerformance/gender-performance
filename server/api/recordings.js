const router = require('express').Router()
const multer = require('multer') //use multer to upload blob data
const upload = multer() // set multer to be the upload variable (just like express, see above ( include it, then use it/set it up))
const fs = require('fs')
const path = require('path')
const {Recording} = require('../db/models')
//util will bring in the promisify function
const util = require('util')
//promisifies the exec function from child_process
const exec = util.promisify(require('child_process').exec)

module.exports = router

//function that actually calls the test.py command
async function getPrediction(filename) {
  const fileDir = `../../tmp/${filename}`
  try {
    //calls and returns the new promisified exec function on test.py
    //with the saved file as the arg
    const resultOfExec = await exec(
      `python ${path.join(
        __dirname,
        '../../gendervoicemodel/test.py'
      )} --file ${path.join(__dirname, fileDir)}`
    )

    //returns the result of the exec function
    return JSON.parse(resultOfExec.stdout)
  } catch (err) {
    console.log(err)
  }
}

router.post('/upload', async (req, res, next) => {
  try {
    const dbRecord = await Recording.create({userId: req.user.id})
    const fileName = `user-${req.user.id}-recording-${dbRecord.id}.wav`
    res.send(fileName)
  } catch (err) {
    console.error(err)
  }
})

router.post('/analyze', upload.single('soundBlob'), async (req, res, next) => {
  try {
    let currTimeStamp = new Date()
    const fileName = req.file.originalname
    const uploadLocation = path.join(__dirname, '../../tmp', `${fileName}`)
    //saves the file to tmp directory
    //this file will only exist on heroku while this route is running.
    console.log(Date.now() - currTimeStamp, 'starting writefileSync')
    fs.writeFileSync(
      uploadLocation,
      Buffer.from(new Uint8Array(req.file.buffer)),
      {flag: 'w+'}
    )
    //run the ML Model and save the result.
    const result = await getPrediction(fileName)
    console.log(Date.now() - currTimeStamp, 'finished ML model')
    res.send(result)

    //Saves the results to the DB
    const dbRecordId = parseInt(
      fileName.slice(fileName.lastIndexOf('-') + 1, fileName.lastIndexOf('.')),
      10
    )

    await Recording.update(
      {
        femaleConfidence: result.fp,
        maleConfidence: result.mp,
        url: req.body.s3Url
      },
      {
        where: {
          id: dbRecordId
        }
      }
    )
  } catch (err) {
    next(err)
  }
})


