import React from 'react'
import {
  Container,
  Card,
  CircularProgress,
} from '@material-ui/core'
import MediaPlayer from './MediaPlayer'
import AudioReactRecorder, {RecordState} from 'audio-react-recorder'
import {connect} from 'react-redux'
import {recordClip, analyzeRecording, setAnalysis} from '../store'
import GraphTabs from './GraphTabs'
import { Redirect } from "react-router-dom"
import Recorder from './Recorder'

class Analysis extends React.Component {
  constructor() {
    super()
    this.state = {
      recordState: null,
    }
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.onStop = this.onStop.bind(this)
  }
  componentDidMount() {
    this.props.setAnalysis('spec')
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

  render() {
    //redirect the user if hard refreshing or going straight to the analysis page
    if(this.props.recordingBlob===null){
      return <Redirect path='/home'/>
    }
    return (
      <Container className="analysisPage" {...this.props}>
        <h1>Analysis</h1>
        <Container className="predAndGraphs" >
          <Card className="prediction">
            <h3>Prediction Results</h3>
            <p>Results represent percent confidence from our</p>
            <p>machine learning model</p>
            {this.props.loading ? (
              <div className="circleProgress">
                <br />
                <CircularProgress />
                <br />
              </div>
            ) : (
              <div className="prediction-results">
                Female Probability Confidence
                <strong>{this.props.prediction.fp}%</strong>
                <br />
                Male Probability Confidence
                <strong>{this.props.prediction.mp}%</strong>
                <br />
              </div>
            )}
            <div className="audio">
              {this.props.recordingURL && <MediaPlayer />}
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
    analysisType: state.analysis.chart
  }
}

const mapDispatch = dispatch => {
  return {
    setAnalysis: chartName => dispatch(setAnalysis(chartName)),
    recordClip: blob => dispatch(recordClip(blob)),
    analyzeRecording: (userId, blob) => dispatch(analyzeRecording(userId, blob))
  }
}

export default connect(mapState, mapDispatch)(Analysis)
