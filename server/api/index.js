const router = require('express').Router()
const {exec} = require('child_process')
const fs = require('fs')
const path = require('path')
module.exports = router

router.use('/users', require('./users'))

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

router.get('/predictions', async (req, res, next) => {
  try {
    checkDir('../../gendervoicemodel')
    await getPrediction()
    let result = realResult
    res.json(result)
  } catch (err) {
    next(err)
  }
})

router.use((req, res, next) => {
  const error = new Error('Not Found')
  error.status = 404
  next(error)
})
