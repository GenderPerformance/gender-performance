//util will bring in the promisify function
const util = require('util')
//promisifies the exec function from child_process
const exec = util.promisify(require('child_process').exec)
const fs = require('fs')
const path = require('path')
const router = require('express').Router()
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    getPrediction().then(data => {
      res.json(data.stdout)
    })
  } catch (err) {
    next(err)
  }
})

//check
function checkDir(dir) {
  if (!fs.existsSync(path.join(__dirname, dir))) {
    console.log('your directory does not exist', dir)
  } else {
    console.log('your directory exists', dir)
  }
}
const fileDir = '../../gendervoicemodel/test-samples/britneytribute.wav'

async function getPrediction() {
  try {
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
