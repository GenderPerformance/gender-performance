import React from 'react'
import {Container, Card} from '@material-ui/core'
import {connect} from 'react-redux'
import {CircularProgress} from '@material-ui/core'

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
              <h4>Analysis</h4>
              {this.props.recording.loading ? (
                <div className="circleProgress">
                  <CircularProgress />
                  <br />
                </div>
              ) : this.props.recording.prediction ? (
                <p>
                  Female Probability Confidence:{' '}
                  {this.props.recording.prediction.fp}%
                  <br />
                  Male Probability Confidence:{' '}
                  {this.props.recording.prediction.mp}%
                </p>
              ) : (
                <p>Please hit ANALYZE to get m/f confidence score.</p>
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
