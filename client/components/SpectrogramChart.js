import React from 'react'
import {
  Container,
  Card,
  Button,
  ButtonGroup
} from '@material-ui/core'
import {connect} from 'react-redux'
import Spectrogram from 'spectrogram'
import chroma from 'chroma-js'

//this component needs <canvas id="canvas1"/> to exist in it's parent component
//in order to work properly
class SpectrogramChart extends React.Component {
  constructor() {
    super()
    this.state = {
    }
    this.spectroRestart=this.spectroRestart.bind(this)
    this.spectroStop=this.spectroStop.bind(this)
    this.createSpectrogram=this.createSpectrogram.bind(this)
    this.drawSpectrogram=this.drawSpectrogram.bind(this)
  }

  //function to create the spectrogram canvas and initial settings.
  //returns the created spectrogram object.
  createSpectrogram(length,width,DOMelement){
  //set canvas height and width using css style elements.
  //using canvas elements will result in a large canvas but not a
  //larger spectrogram.
  DOMelement.style.width = `${length}px`;
  DOMelement.style.height = `${width}px`

  let spectro = Spectrogram(DOMelement, {
      audio: {
        enable: false
      },
      colors: function(steps) {
        let baseColors = [
          [0, 0, 0, 1],
          [0, 255, 255, 1],
          [0, 255, 0, 1],
          [255, 255, 0, 1],
          [255, 0, 0, 1]
        ]
        let positions = [0, 0.15, 0.3, 0.5, 0.75]

        let scale = new chroma.scale(baseColors, positions).domain([0, steps])

        let colors = []

        for (let i = 0; i < steps; ++i) {
          let color = scale(i)
          colors.push(color.hex())
        }

        return colors
      }
    })
    return spectro
  }

  //function to load the recorded data and the created spectrogram canvas to
  //output a spectrogram on the spectrogram canvas
  drawSpectrogram(spectro,soundURL){
    let audioContext = new AudioContext()
      let request = new XMLHttpRequest()
      console.log('soundurl',soundURL)
      request.open('GET', soundURL, true)
      request.responseType = 'arraybuffer'
      request.onload = function() {
        audioContext.decodeAudioData(request.response, function(buffer) {
          spectro.connectSource(buffer, audioContext)
          spectro.start()
        })
      }
      request.send()
  }

  spectroRestart(spectro,url){
    spectro.clear()
    this.drawSpectrogram(spectro,url)
  }

  spectroStop(spectro){
    spectro.pause()
  }

  render() {
    let spectro
    console.log(this.props)
    let DOMelement= document.getElementById('canvas1')
    if (DOMelement&&this.props.recordingURL) {
      //create the spectrogram canvas object object(length,width,elementId)
      spectro = this.createSpectrogram(500,350,DOMelement)
      //draw the spectrogram on analysis
      this.drawSpectrogram(spectro,this.props.recordingURL)
    }else{
      return <div>Loading...</div>
    }
    console.log('render spectro',spectro)
    return (
      <Container maxWidth="sm">
        <ButtonGroup
        variant="contained"
        color="secondary"
        aria-label="contained primary button group">
          {spectro!==undefined?<div><Button onClick={()=>this.spectroRestart(spectro,this.props.recordingURL)}>Spectro restart</Button><Button onClick={()=>this.spectroStop(spectro)}>Spectro stop</Button></div>:<div></div>}
        </ButtonGroup>
      </Container>
    )
  }
}

const mapState = state => {
  return {
    //mapping in user and recording state for a loading screen
    user: state.user,
    recordingURL: state.recording.recordingURL,
    loading: state.recording.loading,
    prediction: state.recording.prediction
  }
}
export default connect(mapState)(SpectrogramChart)
