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
import Cepstrum from './Cepstrum'
import SpectrogramChart from './SpectrogramChart'
import {recordClip, analyzeRecording} from '../store'

class Analysis extends React.Component {
  constructor() {
    super()
    this.state = {
      wavesurfer: null
    }

    this.state = {
      graph: "spec"
    }

    this.handleGraph = this.handleGraph.bind(this);
  }

  componentDidMount() {
    if (!this.state.wavesurfer) {
      const wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'violet',
        progressColor: 'purple',
        plugins: []
      })
      this.setState({wavesurfer: wavesurfer})
    }
  }

  handleGraph(input) {
    this.setState({graph: input})
  }

  handlePlayback(){
    this.state.wavesurfer.playPause()
  }

  render() {
    if (this.props.prediction) {
      const wavesurf = this.state.wavesurfer
      wavesurf.load(this.props.recordingURL)
    }
    return (
      <Container className="analysisPage">
        <h1>Analysis</h1>
        <Container className="predAndGraphs">
          <Card className="prediction">
            <h3>Prediction</h3>
            {this.props.loading ? (
              <div className="circleProgress">
                <br/>
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
                <ButtonGroup
                  variant="contained"
                  aria-label="contained primary button group"
                >
                  <Button onClick={() => this.state.wavesurfer.playPause()}>
                    Play/Pause
                  </Button>
                </ButtonGroup>
              </div>
            )}
            <div id="waveform" />
          </Card>
          <Container className="graphs">
            {this.state.graph === "ceps" ?
              <Cepstrum />
            :
            <div>
              <canvas id='canvas1'></canvas>
              <SpectrogramChart/>
            </div>
            }
            <ButtonGroup
              variant="contained"
              aria-label="contained primary button group"
            >
              <Button onClick={()=>this.handleGraph('spec')}>
                Spectrogram
              </Button>
              <Button onClick={()=>this.handleGraph('ceps')}>
                Cepstrum
              </Button>
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
