const router = require('express').Router()
const multer = require('multer') //use multer to upload blob data
const upload = multer() // set multer to be the upload variable (just like express, see above ( include it, then use it/set it up))
const fs = require('fs')
const path = require('path')
const {Recording} = require('../db/models')
module.exports = router

router.post('/upload', upload.single('soundBlob'), async (req, res, next) => {
  try {
    console.log('Helloooooooooo', req.file)
    const dbRecord = await Recording.create({userId: 1})
    const uploadLocation = path.join(
      __dirname,
      '../../public/uploads/',
      `recording-2.wav`
    )
    fs.writeFileSync(
      uploadLocation,
      Buffer.from(new Uint8Array(req.file.buffer))
    )
    const soundfile = Buffer.from(new Uint8Array(req.file.buffer))
    //TODO: Add call of ML analysis
    //TODO: Await prediction response
    /*
    Delete file after analysis
    fs.unlink(uploadLocation, err => {
      if (err) {
        console.error(err)
      }
    }) */
    res.sendStatus(200)
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