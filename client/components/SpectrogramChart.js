import React from 'react'
import {
  Container,
  CircularProgress,
} from '@material-ui/core'
import {connect} from 'react-redux'
import Spectrogram from './utility/spectrogram'
import chroma from 'chroma-js'
import {setAnalysis} from '../store'

//this component needs <canvas id="canvas1"/> to exist in it's parent component
//in order to work properly
class SpectrogramChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.spectroReset = this.spectroReset.bind(this)
    this.spectroPause = this.spectroPause.bind(this)
    this.spectroStart = this.spectroStart.bind(this)
    this.spectroResume = this.spectroResume.bind(this)
    this.createSpectrogram = this.createSpectrogram.bind(this)
    this.drawSpectrogram = this.drawSpectrogram.bind(this)
  }
  componentDidMount() {
    this.props.setAnalysis('spec')
    this.spectroReset()
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
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
          [59, 41, 69, 1],//background
          [0, 255, 255, 1],//blue
          [0, 255, 0, 1],//green
          [255, 255, 0, 1],//yellow
          [255, 0, 0, 1]//red
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

  //need to call this function first before anything will be rendered
  //on the canvas. this establishes where the waveform will be drawn and
  //rerenders onto the canvas each time. It will also clear the canvas
  //if called even if there is a spectrogram moving across it.
  async spectroReset() {
    //looks like spectro connect source in module automatically clears
    //test this more extensively before completely getting rid of the the code
    // if (this.state.spectro!==null) {
    //   console.log('spectroreset',this.state)
    //   await this.state.spectro.clear()
    //   this.setState({spectro:null})
    // }
    let DOMelement = document.getElementById('canvas1')
    let spectro = this.createSpectrogram(this.props.chartWidth, this.props.chartHeight, DOMelement)
    this.setState({spectro})
  }

  //start the spectro waveform after a reset and the waveform is loaded
  //each time start is hit, it will rerender the spectro waveform. It
  //is possible to have multiple of the same waveform on the canvas which
  //could be confusing.
  spectroStart(url) {
    this.drawSpectrogram(this.state.spectro, url)
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

  componentDidUpdate(prevProps){
    if(prevProps.chartHeight!==this.props.chartHeight){
      this.spectroReset()
    }

    if(this.props.analysisType!=='spec'&&this.props.getAnalysisType){
      this.props.setAnalysis('spec')
    }
    //always refresh analysis type
    if(this.props.getAnalysisType){
      this.props.setAnalysis('spec')
    }
    if(this.props.analysisType==='spec'){
    //some logic to determine what to do with the spectrogram based on prev
    //and curr state of is paused and is ended
    //this logic attempts to childproof the spectrogram if the
    //user hits pause and play repeatedly then tries to switch analysis types and back.
    //since the play button only has is playing and is ended but this component has
    //start, resume, pause, we need extra logic to account for the difference
    //probably an easier way to do this by adding extra states in redux
      if(prevProps.isEnded&&!this.props.isEnded&&!prevProps.isPaused&&this.props.isPaused ||
        !prevProps.isEnded&&!this.props.isEnded&&!prevProps.isPaused&&this.props.isPaused ){
        this.spectroPause()
      }else if(!prevProps.isEnded&&this.props.isEnded&&prevProps.isPaused&&this.props.isPaused){
        this.spectroResume()
      }

      if(prevProps.isEnded!==this.props.isEnded||prevProps.isPaused!==this.props.isPaused){
        if(prevProps.isEnded && !this.props.isPaused){//96% correct
          //play from beginning
          this.spectroStart(this.props.recordingURL)
        }
        else if(!prevProps.isEnded && !this.props.isEnded && !this.props.isPaused){
          this.spectroResume()
        }
      }
    }
  }

  render() {
    if (!this.props.recordingURL) {
      return (
        <div className="circleProgress">
          <CircularProgress />
          <br />
        </div>
      )
    } else {
      return (
        <Container className="spec" maxWidth="sm" >
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
    recordingURL: state.player.recordingURL,
    loading: state.recording.loading,
    prediction: state.recording.prediction,
    isEnded: state.player.isEnded,
    analysisType: state.analysis.chart,
    chartHeight: state.chartSize.h,
    chartWidth: state.chartSize.w
  }
}

const mapDispatch = dispatch => {
  return {
    setAnalysis: chartName => dispatch(setAnalysis(chartName))
  }
}
export default connect(mapState,mapDispatch)(SpectrogramChart)
