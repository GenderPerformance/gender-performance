const router = require('express').Router()
const multer = require('multer') //use multer to upload blob data
const upload = multer() // set multer to be the upload variable (just like express, see above ( include it, then use it/set it up))
const fs = require('fs')
const path = require('path')
const {Recording} = require('../db/models')
const request = require('request')
const axios = require('axios')
module.exports = router

router.post('/upload', upload.single('soundBlob'), async (req, res, next) => {
  try {
    console.log('Helloooooooooo', req.file)
    const dbRecord = await Recording.create({userId: 1})
    const uploadLocation = path.join(
      __dirname,
      '../../public/uploads/',
      `recording-${dbRecord.id}.wav`
    )
    // fs.writeFileSync(
    //   uploadLocation,
    // const wavFile = Buffer.from(new Uint8Array(req.file.buffer))
    //console.log(
    //   'about to hit the python route from node backend with wavFile length',
    //   [...wavFile].length
    // )
    //axios doesn't seem to work for sending stuff to python. using old school deprecated
    //request seems to work

    //encode to base64
    let buff = new Buffer(req.file.buffer)
    let base64data = buff.toString('base64')
    request.post(
      'http://localhost:4000/api/sound',
      {json: base64data},
      (error, res, body) => {
        if (error) {
          console.error(error)
          return
        }
        console.log('statuscode', res.statusCode)
        console.log('body', body)
      }
    )
    //)
    // fs.unlink(uploadLocation, err => {
    //   if (err) {
    //     console.error(err)
    //   }
    // })
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
