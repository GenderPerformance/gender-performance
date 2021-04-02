import React from 'react'
import {
  Container,
  CircularProgress,
  Button,
  ButtonGroup
} from '@material-ui/core'
import {connect} from 'react-redux'
import Spectrogram from './utility/spectrogram'
import chroma from 'chroma-js'

//this component needs <canvas id="canvas1"/> to exist in it's parent component
//in order to work properly
class SpectrogramChart extends React.Component {
  constructor() {
    super()
    this.state = {}
    this.spectroReset = this.spectroReset.bind(this)
    this.spectroPause = this.spectroPause.bind(this)
    this.spectroStart = this.spectroStart.bind(this)
    this.spectroResume = this.spectroResume.bind(this)
    this.createSpectrogram = this.createSpectrogram.bind(this)
    this.drawSpectrogram = this.drawSpectrogram.bind(this)
  }
  componentDidMount(){
    this.spectroReset()
  }
  //function to create the spectrogram canvas and initial settings.
  //returns the created spectrogram object.
  createSpectrogram(width, height, DOMelement) {
    //set canvas height and width using css style elements.
    //using canvas elements will result in a large canvas but not a
    //larger spectrogram.
    DOMelement.style.width = `${width}px`
    DOMelement.style.height = `${height}px`

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
  drawSpectrogram(spectro, soundURL) {
    let audioContext = new AudioContext()
    let request = new XMLHttpRequest()
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

  //start the spectro waveform after a reset and the waveform is loaded
  //each time start is hit, it will rerender the spectro waveform. It
  //is possible to have multiple of the same waveform on the canvas which
  //could be confusing.
  spectroStart(url) {
    this.drawSpectrogram(this.state.spectro, url)
  }

  //need to call this function first before anything will be rendered
  //on the canvas. this establishes where the waveform will be drawn and
  //rerenders onto the canvas each time. It will also clear the canvas
  //if called even if there is a spectrogram moving across it.
  spectroReset() {
    if (this.state.spectro) {
      this.state.spectro.clear()
    }
    let DOMelement = document.getElementById('canvas1')
    let spectro = this.createSpectrogram(600, 400, DOMelement)
    this.setState({spectro})
  }

  //this pauses the spectrogram but it is buggy.
  //if the spectrogram waveform is not finished drawing, it will cut off
  //the rest when pausing
  spectroPause() {
    this.state.spectro.pause()
  }

  //resume the spectro waveform if it is paused
  spectroResume() {
    this.state.spectro.resume()
    //this.state.spectro.
  }

  render() {
    // old code. keep in case we need add the additional conditional check
    // if (!(document.getElementById('canvas1')&&this.props.recordingURL)) {
    if (!this.props.recordingURL) {
      return <div className="circleProgress"><CircularProgress/><br/></div>
    }else{
    return (
      <Container className="spec" maxWidth="sm">
        <ButtonGroup
          variant="contained"
          aria-label="contained primary button group"
        >
          <Button onClick={()=>
            this.spectroPause()}>pause</Button>
          <Button onClick={()=>
            this.spectroStart(this.props.recordingURL)}>Start</Button>
          <Button onClick={()=>
            this.spectroResume()}>Resume</Button>
        </ButtonGroup>
      </Container>
    )
  }
}
}

const mapState = state => {
  return {
    //mapping in user and recording state for a loading screen
    user: state.user,
    isPaused: state.player.isPaused,
    recordingURL: state.recording.recordingURL,
    loading: state.recording.loading,
    prediction: state.recording.prediction,

  }
}

export default connect(mapState)(SpectrogramChart)
