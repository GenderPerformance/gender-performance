const router = require('express').Router()
const {exec} = require('child_process')
module.exports = router

router.use('/users', require('./users'))

const fileDir = '../../gendervoicemodel/test-samples/cloudbufferin.wav'

let realResult

async function getPrediction() {
  return await exec(
    `python ../../gendervoicemodel/test.py --file ${fileDir}`,
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
