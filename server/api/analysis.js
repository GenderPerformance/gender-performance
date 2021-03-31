const router = require('express').Router()
const wav = require('node-wav');
const FFT = require('fft.js');
const fs = require('fs');
const plotlib = require('nodeplotlib');
const multer = require('multer')
const upload = multer()

let wavFile;
router.post('/',  upload.single('soundBlob'), async (req, res, next)=> {
  try  {
    console.log("======IN FOURIER ANALYSIS=======",req.file.buffer)
    //fs.writeFileSync('fouriertest/testfile.wav', Buffer.from(new Uint8Array(req.file.buffer)),{flag: 'w+'})
    const four = plot()
    pl
    res.send(four)
  } catch (err){
    next(err)
  }
})




let buffer =  fs.readFileSync('fouriertest/mariah.wav');
console.log('====BUFFER FILE-=======', buffer)
let size = 4096; //fft size
let fft = new FFT(size); //create fft object
let realOutput = new Array(size); // to store final result
let complexOutput = fft.createComplexArray(); // to store fft output




// open a 1s wav file(mono 16bit pcm file at   32000hz) containing only a 750hz sinusoidal tone


function plot() {
  let result = wav.decode(buffer); // read wav file data
  let audioData = Array.prototype.slice.call( result.channelData[0]); // convert Float32Array to normal array
  let realInput = audioData.slice(0,size); // use only 4096 sample from the buffer.
  fft.realTransform(complexOutput, realInput); // compute fft
  fft.completeSpectrum(complexOutput);
  fft.fromComplexArray(complexOutput,realOutput); // get rid of the complex value and keep only real
  //fs.writeFileSync('fouriertest/arrayfile.js', realOutput, {flag: 'w+'})
  console.log('===REAL OUTPUT=====',realOutput)


  let x =[];
  for(let i=0;i<size;i++){
    x.push(i)
  }


      plotlib.plot( // plotting the fft output
          [{
              x: x,
              y: realOutput,
              type: 'line',
              name:'output'
          }]
      );
  return realOutput
}

console.log('RETURNED OUTPUT ====', plot())
module.exports = router
