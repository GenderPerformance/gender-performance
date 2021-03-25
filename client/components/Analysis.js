import React from 'react'
import {Container, Card} from '@material-ui/core'

export default class Recorder extends React.Component {
  render() {
    if (!this.props.recording) {
      return <div>Loading...</div>
    } else {
      const wavesurfer = WaveSurfer.create({
        container: '#waveform'
      })
      wavesurfer.load(this.props.recording.recordingURL)
      return (
        <Container maxWidth="sm">
          <div>
            <br />
            <br />
            <Card style={{backgroundColor: '#cbae82'}}>
              <h4>Analysis</h4>
              <p>
                Lorem ipsum dolor sit amet, consecteturadipiscing elit. Donec
                viverra eget nullavitae ornare.
              </p>
            </Card>
          </div>
        </Container>
      )
    }
  }
}
