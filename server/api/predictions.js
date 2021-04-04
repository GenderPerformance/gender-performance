//util will bring in the promisify function
const util = require('util')
//promisifies the exec function from child_process
const exec = util.promisify(require('child_process').exec)
const fs = require('fs')
const path = require('path')
const router = require('express').Router()
module.exports = router

//This is the api for directly calling the ML model. it is for testing purposes.

router.get('/', async (req, res, next) => {
  try {
    //calls the function get Prediction waits for data to return before res.json
    const data = await getPrediction()
    res.json(data.stdout)
  } catch (err) {
    next(err)
  }
})

//utility function to check for the existence of a directory
function checkDir(dir) {
  if (!fs.existsSync(path.join(__dirname, dir))) {
    console.log('your directory does not exist', dir)
  } else {
    console.log('your directory exists', dir)
  }
}

//file to be tested by test.py
const fileDir = '../../gendervoicemodel/test-samples/cloudbufferin.wav'
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
