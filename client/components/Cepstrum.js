import React from 'react'
import {connect} from 'react-redux'
import {Button} from '@material-ui/core'
import P5Wrapper from 'react-p5-wrapper'
import 'p5/lib/addons/p5.sound'
import 'p5/lib/addons/p5.dom'
import p5 from 'p5'
import {xAxis} from './utility/axisLabels.js'
export const myp5 = new p5()

class Cepstrum extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sound: null,
      fft: null
    }
    this.sketch = this.sketch.bind(this)
  }

  componentDidMount() {
    //xAxis creates an x axis for the cepstrum analysis
    //should target the div element below the cepstrum analysis
    //the second and third arguments of xAxis should be the width of
    //sketch.  4th and 5th are the frequency range
    xAxis('#cepstralAxis', 0, 600, 0, 4000)
  }

  sketch(p) {
    let width = 600
    let height = 400

    p.preload = () => {
      this.setState({sound: myp5.loadSound(this.props.recordingBlob)})
    }

    p.setup = () => {
      let cnv = p.createCanvas(width, height, p.WEBGL)
      cnv.mouseClicked(this.togglePlay)
      this.setState({fft: new p5.FFT()})
      //this.state.sound.amp(0.2);
    }

    p.draw = () => {
      //draw the background
      p.background('rgba(105,255,0, 0.8)')
      //generate the fft data using samplesize 4096.
      console.log("draw this.state",this.state)
      let spectrum = this.state.fft.analyze(4096)

      //stroke and noFill are for drawing color and making sure
      //nothing is left behind on the DOM
      p.stroke(10)
      p.noFill()
      //the actual drawing of the fft happens in this for loop
      for (let i = 0; i < spectrum.length; i++) {
        let x = p.map(i, 0, spectrum.length, -width / 2, width)
        let h = -height + p.map(spectrum[i], 0, 255, height, 0)
        p.rect(x, height, width / spectrum.length, h)
      }
      //generate the waveform data-follows the same pattern as the fft.
      let waveform = this.state.fft.waveform()
      p.noFill()
      p.beginShape()
      p.stroke(20)
      for (let i = 0; i < waveform.length; i++) {
        let x = p.map(i, 0, waveform.length, -width / 2, width)
        let y = p.map(waveform[i] - 1.15, -1, 1, 0, height / 1.5)
        p.vertex(x, y)
      }
      p.endShape()
    }
  }
  togglePlay() {
    if (this.state.sound.isPlaying()) {
      this.state.sound.pause()
    } else {
      this.state.sound.play()
    }
  }

  render() {
    console.log(this.state)
    if (!this.props.recordingBlob) {
      return <div>Loading...</div>
    } else {
      return (
        <div>
          <div className="cepstral">
            <P5Wrapper sketch={this.sketch} />
          </div>
          <div id="cepstralAxis" />
          <Button variant="contained" onClick={() => this.togglePlay()}>Play</Button>
        </div>
      )
    }
  }
}

const mapState = state => {
  return {
    recordingURL: state.recording.recordingURL,
    recordingBlob: state.recording.recordingBlob
  }
}

export default connect(mapState)(Cepstrum)
