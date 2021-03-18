const {exec} = require('child_process')
const fs = require('fs')
const path = require('path')
const router = require('express').Router()
module.exports = router

router.get('/', async (req, res, next) => {
  try {
    checkDir('../../gendervoicemodel')
    await getPrediction()
    let result = realResult
    res.json(result)
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

let realResult

async function getPrediction() {
  return await exec(
    `python ${path.join(
      __dirname,
      '../../gendervoicemodel/test.py'
    )} --file ${path.join(__dirname, fileDir)}`,
    (error, data, getter) => {
      if (error) {
        console.log('error', error.message)
        return
      }
      if (getter) {
        console.log('data', data)
        realResult = data
        return
      }
      console.log('data', data)
    }
  )
}
