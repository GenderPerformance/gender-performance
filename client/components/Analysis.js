import React from 'react'
import {
  Container,
  Card,
  CircularProgress,
  Fade,
} from '@material-ui/core'
import MediaPlayer from './MediaPlayer'
import AudioReactRecorder, {RecordState} from 'audio-react-recorder'
import {connect} from 'react-redux'
import {recordClip, analyzeRecording, setAnalysis, setDimensions} from '../store'
import GraphTabs from './GraphTabs'
import { Redirect } from "react-router-dom"

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
      fade:true
    }
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.onStop = this.onStop.bind(this)
    this.updateDimensions = this.updateDimensions.bind(this)
    this.fading = this.fading.bind(this)
  }

  componentDidMount() {
    //update chart dimensions for current window size
    this.props.setAnalysis('spec')
    let windowDim=calcHeightWidth()
    this.props.setDimensions(windowDim.h,windowDim.w)
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
    //update props dimensions for charts based on current window size
    let windowDim=calcHeightWidth()
    this.props.setDimensions(windowDim.h,windowDim.w)
  }

  fading(){
    if(this.state.fade) {this.setState({fade:false})}
    else {this.setState({fade:true})}
  }

  render() {
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
            <div id='centeredText'>Results represent percent confidence interval (CI)</div>
            <div id='centeredText'>from our machine learning model</div>
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
            {this.props.recordingURL &&
            <Fade in={this.state.fade} timeout={{
              enter: 2000,
              exit: 100,
            }}>
              <MediaPlayer />
            </Fade>}
            <button onClick={this.fading}>Fade</button>
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
    chartHeight: state.chartSize.h,
    chartWidth: state.chartSize.w,
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
