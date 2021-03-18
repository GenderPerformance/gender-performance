const {exec} = require('child_process')
const fs = require('fs')
const path = require('path')
const router = require('express').Router()
module.exports = router
let realResult

router.get('/', async (req, res, next) => {
  try {
    checkDir('../../gendervoicemodel')
    await getPrediction().then(data => {
      console.log('got out of get prediction fxn')
      let result = realResult
      console.log('.then promise result', data)
      res.json(result)
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
  return await exec(
    `python ${path.join(
      __dirname,
      '../../gendervoicemodel/test.py'
    )} --file ${path.join(__dirname, fileDir)}`,
    (error, data, getter) => {
      if (error) {
        console.log('exec error trying to run python test.py', error.message)
        return
      }
      if (getter) {
        console.log('data getter', data)
        realResult = data
        return data
      }
      console.log('no error and no getter', data)
    }
  )
}
