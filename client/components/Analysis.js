import React from 'react'
import {Container, Card, CircularProgress} from '@material-ui/core'
import {connect} from 'react-redux'

class Analysis extends React.Component {
  render() {
    if (!this.props.recording) {
      return <div>Loading...</div>
    } else {
      const SpectrogramPlugin = window.WaveSurfer.spectrogram

      const wavesurfer = WaveSurfer.create({
        container: '#waveform',
        plugins: []
      })
      wavesurfer.load(this.props.recording.recordingURL)
      return (
        <Container maxWidth="sm">
          <div>
            <br />
            <br />
            <Card style={{backgroundColor: '#cbae82'}}>
              <h3>Analysis</h3>
              {this.props.recording.loading ? (
                <div className="circleProgress">
                  <CircularProgress />
                  <br />
                </div>
              ) : this.props.recording.prediction ? (
                <div className="analysis">
                  Female Probability Confidence
                  <strong>{this.props.recording.prediction.fp}%</strong>
                  <br />
                  Male Probability Confidence
                  <strong>{this.props.recording.prediction.mp}%</strong>
                </div>
              ) : (
                <div className="analysis">
                  <p>
                    Please hit <strong>ANALYZE</strong> to get m/f confidence
                    score.
                  </p>
                </div>
              )}
            </Card>
          </div>
        </Container>
      )
    }
  }
}

const mapState = state => {
  return {
    //mapping in user and recording state for a loading screen
    user: state.user,
    recording: state.recording,
    //what is audioData supposed to be?
    audioData: state.recordingBlob
  }
}
export default connect(mapState)(Analysis)
