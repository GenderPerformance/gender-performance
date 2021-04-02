import React from 'react'
import {
  Container,
  Card,
  CircularProgress,
  Button,
  ButtonGroup
} from '@material-ui/core'
import MediaPlayer from './MediaPlayer'
import AudioReactRecorder, {RecordState} from 'audio-react-recorder'
import {connect} from 'react-redux'
import WaveSurfer from 'wavesurfer.js'
import Cepstrum from './Cepstrum'
import SpectrogramChart from './SpectrogramChart'
import {recordClip, analyzeRecording} from '../store'
import WaveForm from './WaveForm'

class Analysis extends React.Component {
  constructor() {
    super()
    this.state = {
      wavesurfer: null,
      recordState: null,
      graph: 'spec'
    }
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.onStop = this.onStop.bind(this)
    this.handleGraph = this.handleGraph.bind(this)
  }

  componentDidMount() {
    if (!this.state.wavesurfer) {
      const wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'purple',
        progressColor: 'purple',
        plugins: []
      })
      this.setState({wavesurfer: wavesurfer})
    }
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
    this.setState({graph: input})
  }


  render() {

    return (
      <Container className="analysisPage">
        <h1>Analysis</h1>
        <Container className="predAndGraphs">
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
              canvasWidth="900"
              canvasHeight={this.state.recordState === RecordState.START ? '150' : '0'}
            />
          </div>
            <div id="waveform" />
          </Card>
          <Container className="graphs">
            {this.state.graph === 'ceps' ? (
              <Cepstrum />
            ) : (
              <div>
                <canvas id="canvas1" />
                <SpectrogramChart />
              </div>
            )}
            {this.state.graph === 'wave' ? (<WaveForm/>) :(  <div>
                <canvas id="canvas1" />
                <SpectrogramChart />
              </div>) }
            <ButtonGroup
              variant="contained"
              aria-label="contained primary button group"
            >
              <Button onClick={() => this.handleGraph('spec')}>Spectrogram</Button>
              <Button onClick={() => this.handleGraph('ceps')}>Cepstrum</Button>
              <Button onClick={()=> this.handleGraph('wave')}>Waveform</Button>
            </ButtonGroup>
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
    prediction: state.recording.prediction
  }
}

const mapDispatch = dispatch => {
  return {
    recordClip: blob => dispatch(recordClip(blob)),
    analyzeRecording: (userId, blob) => dispatch(analyzeRecording(userId, blob))
  }
}

export default connect(mapState, mapDispatch)(Analysis)
