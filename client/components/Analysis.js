import React from 'react'
import {
  Container,
  Card,
  CircularProgress,
  Fade,
  Typography
} from '@material-ui/core'
import MediaPlayer from './MediaPlayer'
import AudioReactRecorder, {RecordState} from 'audio-react-recorder'
import {connect} from 'react-redux'
import {
  recordClip,
  analyzeRecording,
  setAnalysis,
  setDimensions,
  mediaPlayerFadeFalse,
  mediaPlayerFadeTrue
} from '../store'
import GraphTabs from './GraphTabs'
import {Redirect} from 'react-router-dom'
import Timeout from 'await-timeout'

function calcHeightWidth() {
  //calculates the smallest width height dimensions
  //for the current window
  let h
  let w
  let hIn = window.innerHeight
  let hOut = window.outerHeight
  let wIn = window.innerWidth
  let wOut = window.outerWidth
  let ratio = 0.666666666

  if (hIn < hOut) h = hIn
  else h = hOut

  if (wIn < wOut) w = wIn
  else w = wOut

  //figures out the limiting dimension and calculates the other
  //dimenions off of it
  if (w * ratio < h) h = Math.round(w * ratio)
  else w = Math.round(h / ratio)

  return {h, w}
}

class Analysis extends React.Component {
  constructor() {
    super()
    this.state = {
      recordState: null
    }
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.onStop = this.onStop.bind(this)
    this.updateDimensions = this.updateDimensions.bind(this)
  }

  componentDidMount() {
    //update chart dimensions for current window size
    this.props.setAnalysis('spec')
    let windowDim = calcHeightWidth()
    this.props.setDimensions(windowDim.h, windowDim.w)
    window.addEventListener('resize', this.updateDimensions)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions)
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
    let windowDim = calcHeightWidth()
    this.props.setDimensions(windowDim.h, windowDim.w)
  }

  async componentDidUpdate(prevProps) {
    //flips the state of mediaPlayerFade to force a re-render of the
    //fade effect of mediaplayer each time we switch analyses
    if (this.props.mediaPlayerFade === false) {
      await Timeout.set(120)
      this.props.mediaPlayerFadeTrue()
    } else if (prevProps.analysisType !== this.props.analysisType) {
      if (prevProps.mediaPlayerFade === true) {
        this.props.mediaPlayerFadeFalse()
      }
    }

  }

  render() {
    //redirect the user if hard refreshing or going straight to the analysis page
    if (this.props.recordingBlob === null) {
      return <Redirect to="/home" path="/home" />
    }
    return (
      <Container className="analysisPage" {...this.props}>
        <Typography variant="h4"></Typography>
        <Container className="predAndGraphs">
          <Card className="prediction">
            <Typography variant="h5">Prediction Results</Typography>
            <div id="centeredText">
              <Typography>
                Results represent percent confidence<br />
                from our machine learning model
              </Typography>
            </div>
            <br />
            {this.props.loading ? (
              <div className="circleProgress">
                <br />
                <CircularProgress />
                <br />
              </div>
            ) : (typeof this.props.prediction.fp === 'number')
            ? (<div className="prediction-results">
                <div className="CI">
                  <span>
                    <Typography>Feminine -- </Typography>
                  </span>
                  <span>
                    <Typography>{this.props.prediction.fp}%</Typography>
                  </span>
                </div>
                <div className="CI">
                  <span>
                    <Typography>Masculine -- </Typography>
                  </span>
                  <span>
                    <Typography>{this.props.prediction.mp}%</Typography>
                  </span>
                </div>
              </div>
            ) : (<h3 style={{textAlign:"center", color:"#3B2945", fontStyle:"italic"}}>{this.props.prediction.fp}<br/>
                {this.props.prediction.mp}{console.log('TYPE OF:',typeof this.props.prediction.fp)}</h3>)}
          </Card>
          <Container className="graphs">
            <br/>
            <GraphTabs />
            <br/>
            {this.props.recordingURL && (
              <Fade
                in={this.props.mediaPlayerFade}
                timeout={{
                  enter: 2000,
                  exit: 100
                }}
              >
                <MediaPlayer />
              </Fade>
            )}
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
    mediaPlayerFade: state.switches.mediaPlayerFade
  }
}

const mapDispatch = dispatch => {
  return {
    setAnalysis: chartName => dispatch(setAnalysis(chartName)),
    recordClip: blob => dispatch(recordClip(blob)),
    analyzeRecording: (userId, blob) =>
      dispatch(analyzeRecording(userId, blob)),
    setDimensions: (h, w) => dispatch(setDimensions(h, w)),
    mediaPlayerFadeTrue: () => dispatch(mediaPlayerFadeTrue()),
    mediaPlayerFadeFalse: () => dispatch(mediaPlayerFadeFalse())
  }
}

export default connect(mapState, mapDispatch)(Analysis)
