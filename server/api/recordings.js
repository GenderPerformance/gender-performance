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
async function getPrediction(userId) {
  const fileDir = `../../tmp/recording-${userId}.wav`
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
    return resultOfExec
  } catch (err) {
    console.log(err)
  }
}

router.post('/upload', upload.single('soundBlob'), async (req, res, next) => {
  try {
    console.log('the user accessing the route is:', req.user)
    //need to change saved file with a variable name.
    //make sure to adjust filDir variable as well
    const dbRecord = await Recording.create({userId: 1})
    const uploadLocation = path.join(
      __dirname,
      '../../tmp',
      `recording-${req.user.id}.wav`
    )
    //saves the file to tmp directory. create a new file if it does not exist
    //this file will only exist on heroku while this route is running.
    fs.writeFileSync(
      uploadLocation,
      Buffer.from(new Uint8Array(req.file.buffer)),
      {flag: 'w+'}
    )
    //run the ML Model and save the result.
    result = await getPrediction(req.user.id)
    //TODO: Add call of ML analysis
    //TODO: Await prediction response
    res.send(result)
  } catch (err) {
    next(err)
  }
})
