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
import {recordClip, analyzeClip} from '../store'

class Analysis extends React.Component {
  constructor() {
    super()
    this.state = {
      wavesurfer: null
    }
  }

  componentDidMount() {
    if (!this.state.wavesurfer) {
      const wavesurfer = WaveSurfer.create({
        container: '#waveform',
        plugins: []
      })
      this.setState({wavesurfer: wavesurfer})
    }
  }
  render() {
    if (this.props.prediction) {
      const wavesurf = this.state.wavesurfer
      wavesurf.load(this.props.recordingURL)
    }
    return (
      <Container maxWidth="sm">
        <div>
          <br />
          <br />
          <Card style={{backgroundColor: '#cbae82'}}>
            <h3>Analysis</h3>
            {this.props.loading ? (
              <div className="circleProgress">
                <CircularProgress />
                <br />
              </div>
            ) : (
              <div className="analysis">
                Female Probability Confidence
                <strong>{this.props.prediction.fp}%</strong>
                <br />
                Male Probability Confidence
                <strong>{this.props.prediction.mp}%</strong>
                <br />
                <ButtonGroup
                  variant="contained"
                  color="secondary"
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
        </div>
      </Container>
    )
  }
}

const mapState = state => {
  return {
    //mapping in user and recording state for a loading screen
    user: state.user,
    recordingURL: state.recording.recordingURL,
    recordingBlob: state.recording.recordingBlob,
    loading: state.recording.loading,
    prediction: state.recording.prediction
  }
}

const mapDispatch = dispatch => {
  return {
    recordClip: blob => dispatch(recordClip(blob)),
    analyzeClip: (userId, blob) => dispatch(analyzeClip(userId, blob))
  }
}

export default connect(mapState, mapDispatch)(Analysis)
