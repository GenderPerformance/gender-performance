import React from 'react'
import {
  Container,
  Card,
  CircularProgress,
} from '@material-ui/core'
import MediaPlayer from './MediaPlayer'
import AudioReactRecorder, {RecordState} from 'audio-react-recorder'
import {connect} from 'react-redux'
import {recordClip, analyzeRecording, setAnalysis, setDimensions} from '../store'
import GraphTabs from './GraphTabs'
import { Redirect } from "react-router-dom"
import Resonance from './Resonance'

function calcHeightWidth(){
  //calculates the smallest width height dimensions
  //for the current window
  let h
  let w
  let hIn=window.innerHeight
  let hOut=window.outerHeight
  let wIn=window.innerWidth
  let wOut=window.outerWidth
  let ratio = 0.666666666

  if(hIn<hOut) h=hIn
  else h=hOut

  if(wIn<wOut) w=wIn
  else w=wOut

  //figures out the limiting dimension and calculates the other
  //dimenions off of it
  if(w*ratio<h) h=Math.round(w*ratio)
  else w=Math.round(h/ratio)

  return {h,w}
}

class Analysis extends React.Component {
  constructor() {
    super()
    this.state = {
      recordState: null,
    }
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.onStop = this.onStop.bind(this)
    this.updateDimensions = this.updateDimensions.bind(this)
  }

  componentDidMount() {
    this.props.setAnalysis('spec')
    let windowDim=calcHeightWidth()
    this.props.setDimensions(windowDim.h,windowDim.w)
    console.log('analysis component did mount',this.props)
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }

  start() {
    this.props.clearRecording()
    this.setState({
      recordState: RecordState.START
    })
  }

  stop() {
    this.setState({
      recordState: RecordState.STOP
    })
  }

  onStop(audioData) {
    this.props.recordClip(audioData)
  }

  handleGraph(input) {
    this.props.setAnalysis(input)
  }

  updateDimensions() {
    //thunk to update dimensions and add to redux state
    //take the smaller between inner and outer dimension
    let windowDim=calcHeightWidth()
    this.props.setDimensions(windowDim.h,windowDim.w)
    console.log('analysis update dimensions',windowDim)
  }

  render() {
    console.log('ananylsis render',this.props)
    //redirect the user if hard refreshing or going straight to the analysis page
    if(this.props.recordingBlob===null){
      return <Redirect to= '/home' path='/home'/>
    }
    return (
      <Container className="analysisPage" {...this.props}>
        <h1>Analysis</h1>
        <Container className="predAndGraphs" >
          <Card className="prediction">
            <h3>Prediction Results</h3>
            <div id='centeredText'>Results represent percent confidence from</div>
            <div id='centeredText'>our machine learning model</div>
            <br></br>
            {this.props.loading ? (
              <div className="circleProgress">
                <br />
                <CircularProgress />
                <br />
              </div>
            ) : (
              <div className="prediction-results">
                <div className="CI">
                  Female CI
                  <strong>{" "+this.props.prediction.fp}%</strong>
                </div>
                <br />
                <div className="CI">
                  Male CI
                  <strong>{" "+this.props.prediction.mp}%</strong>
                </div>
                <br/>
              </div>
            )}
            <div className="audio">
              <AudioReactRecorder
                text-align="center"
                state={this.state.recordState}
                onStop={this.onStop}
                backgroundColor="rgb(255,255,255)"
                foregroundColor="rgb(159,48,226)"
                canvasWidth="10"
                canvasHeight={
                  this.state.recordState === RecordState.START ? '150' : '0'
                }
              />
            </div>
          </Card>
          <Container className="graphs">
            {this.props.recordingURL && <MediaPlayer />}
            <GraphTabs/>
          </Container>
        </Container>
      </Container>
    )
  }
}

const mapState = state => {
  return {
    //mapping in user and recording state for a loading screen
    user: state.user,
    recordingURL: state.player.recordingURL,
    recordingBlob: state.recording.recordingBlob,
    loading: state.recording.loading,
    prediction: state.recording.prediction,
    analysisType: state.analysis.chart,
    screenHeight: state.screensize.h,
    screenWidth: state.screensize.w,
  }
}

const mapDispatch = dispatch => {
  return {
    setAnalysis: chartName => dispatch(setAnalysis(chartName)),
    recordClip: blob => dispatch(recordClip(blob)),
    analyzeRecording: (userId, blob) => dispatch(analyzeRecording(userId, blob)),
    setDimensions: (h,w) => dispatch(setDimensions(h,w))
  }
}

export default connect(mapState, mapDispatch)(Analysis)
