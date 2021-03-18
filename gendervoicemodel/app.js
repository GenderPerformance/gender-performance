const util = require('util')
const {exec} = require('child_process')
const express = require('express')
const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

const fileDir = 'test-samples/britneytribute.wav'

let realResult

async function getPrediction() {
  return await exec(
    `python test.py --file ${fileDir}`,
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
app.get('/', async (req, res) => {
  try {
    await getPrediction()
    let result = realResult
    res.json(result)
  } catch (err) {
    console.log(err)
  }
})

app.listen(3000, () => {
  console.log(`Serving python model`)
})
