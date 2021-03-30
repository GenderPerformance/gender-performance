import React from 'react'
import {
  Container,
  Card,
  CircularProgress,
  Button,
  ButtonGroup
} from '@material-ui/core'
import {connect} from 'react-redux'
import WaveSurfer from 'wavesurfer.js'
import Spectrogram from 'spectrogram'
import chroma from 'chroma-js'
//import * as P5 from "p5"
//window.myp5 = new P5
import '../../node_modules/p5/lib/addons/p5.sound'
import '../../node_modules/p5/lib/addons/p5.dom'
import p5 from 'p5'
import Drawing from './Drawing'
import {myp5} from './Drawing'


let sound = myp5.loadSound('./tryp5.mp3')
function preload() {
  console.log('SOUND?', sound)
}
function togglePlay() {
  console.log('INSTANCE', myp5)
  myp5.loadSound()
  console.log('INSTANCEKEYS', Object.keys(myp5))
  console.log('p5=====', p5)
  console.log('p5 SOUND', p5.sound)
  console.log('p5 KEYS', Object.keys(p5))
  if (sound.isPlaying()) {
    sound.pause()
  } else {
    sound.loop()
  }
}

class Analysis extends React.Component {
  constructor() {
    super()
    this.state = {
      wavesurfer: null
    }
  }

  componentDidMount() {
    if (!this.state.wavesurfer) {
      console.log('wavesurfing???')
      const wavesurfer = WaveSurfer.create({
        container: '#waveform',
        plugins: []
      })
      this.setState({wavesurfer: wavesurfer})
    }
  }
  render() {
    if (this.props.prediction) {
      const wavesurf = this.state.wavesurfer
      wavesurf.load(this.props.recordingURL)

      // //spectrogram attempt
      let spectro = Spectrogram(document.getElementById('canvas'), {
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

      let audioContext = new AudioContext()
      let request = new XMLHttpRequest()
      request.open('GET', this.props.recordingURL, true)
      request.responseType = 'arraybuffer'

      request.onload = function() {
        audioContext.decodeAudioData(request.response, function(buffer) {
          spectro.connectSource(buffer, audioContext)
          spectro.start()
          //setTimeout(spectro.pause(),10000)
        })
      }
      request.send()
    }
    return (
      <Container maxWidth="sm">
        <div>
          <br />
          <br />
          <Card style={{backgroundColor: '#cbae82'}}>
            <h3>Analysis</h3>
            {this.props.loading ? (
              <div className="circleProgress">
                <CircularProgress />
                <br />
              </div>
            ) : (
              <div className="analysis">
                Female Probability Confidence
                <strong>{this.props.prediction.fp}%</strong>
                <br />
                Male Probability Confidence
                <strong>{this.props.prediction.mp}%</strong>
                <br />
                <ButtonGroup
                  variant="contained"
                  color="secondary"
                  aria-label="contained primary button group"
                >
                  <Button onClick={() => this.state.wavesurfer.playPause()}>
                    Play/Pause
                  </Button>
                </ButtonGroup>
              </div>
            )}
            <Drawing />
            <div id="waveform" />
          </Card>
        </div>
      </Container>
    )
  }
}

const mapState = state => {
  return {
    //mapping in user and recording state for a loading screen
    user: state.user,
    recordingURL: state.recording.recordingURL,
    recordingBlob: state.recording.recordingBlob,
    loading: state.recording.loading,
    prediction: state.recording.prediction
  }
}
export default connect(mapState)(Analysis)
