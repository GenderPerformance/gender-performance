const router = require('express').Router()
const multer = require('multer') //use multer to upload blob data
const upload = multer() // set multer to be the upload variable (just like express, see above ( include it, then use it/set it up))
const fs = require('fs')
const path = require('path')
const {Recording} = require('../db/models')
module.exports = router
const fileDir = '../../tmp/recording-1.wav'
//function that actually calls the test.py command
async function getPrediction() {
  try {
    //calls and returns the new promisified exec function on test.py
    const resultOfExec = await exec(
      `python ${path.join(
        __dirname,
        '../../gendervoicemodel/test.py'
      )} --file ${path.join(__dirname, fileDir)}`
    )
    return resultOfExec
  } catch (err) {
    console.log(err)
  }
}

router.post('/upload', upload.single('soundBlob'), async (req, res, next) => {
  try {
    console.log('Helloooooooooo', req.file)
    const dbRecord = await Recording.create({userId: 1})
    const uploadLocation = path.join(__dirname, '../../tmp', `recording-1.wav`)
    fs.writeFileSync(
      uploadLocation,
      Buffer.from(new Uint8Array(req.file.buffer))
    )
    result = getPrediction()
    console.log(result)
    //const soundfile = Buffer.from(new Uint8Array(req.file.buffer))
    //TODO: Add call of ML analysis
    //TODO: Await prediction response
    /*
    Delete file after analysis
    fs.unlink(uploadLocation, err => {
      if (err) {
        console.error(err)
      }
    }) */
    res.send(result)
  } catch (err) {
    next(err)
  }
})

// const express = require('express'); //make express available
// const app = express(); //invoke express
// const multer  = require('multer') //use multer to upload blob data
// const upload = multer(); // set multer to be the upload variable (just like express, see above ( include it, then use it/set it up))
// const fs = require('fs'); //use the file system so we can save files

// app.post('/upload', upload.single('soundBlob'), function (req, res, next) {
//   // console.log(req.file); // see what got uploaded
//   let uploadLocation = __dirname + '/public/uploads/' + req.file.originalname // where to save the file to. make sure the incoming name has a .wav extension
//   fs.writeFileSync(uploadLocation, Buffer.from(new Uint8Array(req.file.buffer))); // write the blob to the server as a file
//   res.sendStatus(200); //send back that everything went ok
// })
