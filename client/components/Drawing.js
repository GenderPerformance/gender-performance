import React from 'react'
import {connect} from 'react-redux'
import {Button} from '@material-ui/core'

import P5Wrapper from 'react-p5-wrapper'
import '../../node_modules/p5/lib/addons/p5.sound'
import '../../node_modules/p5/lib/addons/p5.dom'
import p5 from 'p5'

export const myp5 = new p5()
//let sound = myp5.loadSound('./tryp5.mp3')

// function preload() {
//   console.log('SOUND?', sound)
// }

// function togglePlay() {
//   console.log('INSTANCE', myp5)
//   myp5.loadSound()
//   console.log('INSTANCEKEYS', Object.keys(myp5))
//   console.log('p5=====', p5)
//   console.log('p5 SOUND', p5.sound)
//   console.log('p5 KEYS', Object.keys(p5))
//   if (sound.isPlaying()) {
//     sound.pause()
//   } else {
//     sound.loop()
//   }
//
class Drawing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sound: null,
      fft: null
    }
    // this.setup = this.setup.bind(this)
    // this.draw = this.draw.bind(this)
    // this.togglePlay = this.togglePlay.bind(this)
    // this.preload = this.preload.bind(this)
    this.sketch = this.sketch.bind(this)
  }

  sketch(p) {
    p.preload = () => {
      this.setState({sound: myp5.loadSound(this.props.recordingBlob)})
    }

    p.setup = () => {
      let cnv = p.createCanvas(880, 400, p.WEBGL)
      cnv.mouseClicked(this.togglePlay)
      this.setState({fft: new p5.FFT()})
      //this.state.sound.amp(0.2);
    }
    p.draw = () => {
      //p.createCanvas(600, 400, p.WEBGL)
      p.background('rgba(255,255,0, 0.25)')
      let spectrum = this.state.fft.analyze()
      p.stroke(10)
      p.noFill()
      for (let i = 0; i < spectrum.length; i++) {
        let x = p.map(i, 0, spectrum.length, 0, width)
        let h = -height + p.map(spectrum[i], 100, 255, height, 0)
        p.rect(x, height, width / spectrum.length, h)
      }
      let waveform = this.state.fft.waveform()
      p.noFill()
      p.beginShape()
      p.stroke(20)
      for (let i = 0; i < waveform.length; i++) {
        let x = p.map(i, 0, waveform.length, 0, width)
        let y = p.map(waveform[i], -1, 1, 0, height)
        p.vertex(x, y)
      }
      p.endShape()
      //creates errors
      //text('tap to play', 20, 20)
    }
  }
  togglePlay() {
    console.log('===STATE SOUND====', this.state.sound)
    //console.log('p5 KEYS', Object.keys(p5))
    if (this.state.sound.isPlaying()) {
      this.state.sound.pause()
    } else {
      this.state.sound.play()
    }
  }

  render() {
    console.log(`DRAWING PROPS======`, this.props)
    if (!this.props.recordingBlob) {
      ;<div>Loading...</div>
    } else {
      return (
        <div>
          <P5Wrapper sketch={this.sketch} />
          <Button onClick={() => this.togglePlay()}>P5-IFY</Button>
          {/* <Sketch preload={this.preload} setup={this.setup} draw={this.draw} /> */}
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

export default connect(mapState)(Drawing)
