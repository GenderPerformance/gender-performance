import React from 'react'
import {connect} from 'react-redux'
import P5Wrapper from 'react-p5-wrapper'
import 'p5/lib/addons/p5.sound'
import 'p5/lib/addons/p5.dom'
import p5 from 'p5'
import {xAxis} from './utility/axisLabels.js'
import {setAnalysis, mediaPlayerFadeFalse, mediaPlayerFadeTrue} from '../store'

export const myp5 = new p5()
class Resonance extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      sound: null,
      fft: null,
    }
    this.sketch = this.sketch.bind(this)
  }

  componentDidMount() {
    //xAxis creates an x axis for the resonance analysis
    //should target the div element below the resonance analysis
    //the second and third arguments of xAxis should be the width of
    //sketch.  4th and 5th are the frequency range
    xAxis('#cepstralAxis', 0, this.props.chartWidth, 0, 4000)
    this.props.setAnalysis('reso')
    window.addEventListener('resize', this.updateDimensions);
  }

  //the method that creates resonance analysis chart
  sketch(p) {
    let width = this.props.chartWidth
    let height = this.props.chartHeight
    p.preload = async () => {
      await this.setState({sound: myp5.loadSound(this.props.recordingBlob)})
    }

    p.setup = async () => {
      let cnv = p.createCanvas(width, height, p.WEBGL)
      cnv.mouseClicked(this.togglePlay)
      await this.setState({fft: new p5.FFT()})
      //this.state.sound.amp(0.2);
    }

    p.draw = () => {
      //draw the background
      p.background('rgba(96, 186, 175, 0.5)')
      //generate the fft data using samplesize 4096.
      let spectrum = this.state.fft.analyze(4096)

      //stroke and noFill are for drawing color and making sure
      //nothing is left behind on the DOM
      p.stroke(159, 48, 226)
      p.noFill()
      //the actual drawing of the fft happens in this for loop
      for (let i = 0; i < spectrum.length; i++) {
        let x = p.map(i, 0, spectrum.length, -width / 2, width)
        let h = -height + p.map(spectrum[i], 8, 300, height, 0)
        p.rect(x, height, width / spectrum.length, h)
      }
      //generate the waveform data-follows the same pattern as the fft.
      let waveform = this.state.fft.waveform()
      p.noFill()
      p.beginShape()
      p.stroke(59, 41, 69)
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

  //since volume is set before passing the waveform to be rendered for this
  //component/module, the volume for this component needs to be set at max in order to
  //see correct waveform. This, we have to silence the media player
  //and playback from this component when the play button is hit on the media player
  //When we leave this component, the player needs to be paused and reset.
  componentWillUnmount(){
    //stop and reset this player if we move away from this component
    this.state.sound.pause()
    this.state.sound.currentTime=0
    window.removeEventListener('resize', this.updateDimensions);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.chartHeight!==this.props.chartHeight){
      return this.forceUpdate()
    }

    //if on this component and not reso, set analysisType to reso
    if(this.props.analysisType!=='reso'&&this.props.getAnalysisType){
      this.props.setAnalysis('reso')
    }

    //since volume is set before passing the waveform to be rendered
    //we have to silence the media player and play volume from this component
    //logic to play and pause this player based on play button states
    if(this.props.analysisType==='reso'){
      if (
        prevProps.isPaused !== this.props.isPaused &&
        this.props.isPaused === true
      ) {
        this.state.sound.pause()
      } else if (
        prevProps.isPaused !== this.props.isPaused &&
        this.props.isPaused === false
      ) {
        this.state.sound.play()
      }
    }
  }

  render() {
    if (!this.props.recordingBlob&&!this.props.chartHeight) {
      return <div>Loading...</div>
    } else {
      return (
        <div {...this.props}>
          <div className="cepstral">
            <P5Wrapper sketch={this.sketch} />
          </div>
          <div id="cepstralAxis" />
        </div>
      )
    }
  }
}

const mapState = state => {
  return {
    isPaused: state.player.isPaused,
    recordingURL: state.player.recordingURL,
    recordingBlob: state.recording.recordingBlob,
    analysisType: state.analysis.chart,
    chartHeight: state.chartSize.h,
    chartWidth: state.chartSize.w,
    mediaPlayerFade: state.switches.mediaPlayerFade
  }
}

const mapDispatch = dispatch => {
  return {
    setAnalysis: chartName => dispatch(setAnalysis(chartName)),
    mediaPlayerFadeTrue:()=>dispatch(mediaPlayerFadeTrue()),
    mediaPlayerFadeFalse:()=>dispatch(mediaPlayerFadeFalse())
  }
}

export default connect(mapState,mapDispatch)(Resonance)
