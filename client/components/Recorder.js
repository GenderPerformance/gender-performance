import React from 'react'
import AudioReactRecorder, {RecordState} from 'audio-react-recorder'
import {Link} from 'react-router-dom'
import {useDispatch, connect} from 'react-redux'
import {recordClip, analyzeClip} from '../store'
import {Container, ButtonGroup, Button, Card} from '@material-ui/core'

class Recorder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      recordState: null,
      recordingUrl: null,
      recordingBlob: null
    }
  }

  start = () => {
    this.setState({
      recordState: RecordState.START
    })
  }

  stop = () => {
    this.setState({
      recordState: RecordState.STOP
    })
  }

  //audioData contains blob and blobUrl
  onStop = audioData => {
    console.log('audioData', audioData)
    this.setState({recordingBlob: audioData.blob, recordingUrl: audioData.url})
    this.props.recordClip(audioData)
  }

  render() {
    const {recordState, recordingBlob} = this.state

    return (
      <Container maxWidth="sm">
        <div className="recorder">
          <br />
          <Card style={{backgroundColor: '#55e7ff'}}>
            <div className="performance">Performance</div>
          </Card>
          <br />
          <AudioReactRecorder
            text-align="center"
            state={recordState}
            onStop={this.onStop}
            backgroundColor="rgb(57,28,113,.01)"
            foregroundColor="rgb(85,231,255,.4)"
          />
          <audio
            id="audio"
            controls
            src={this.state.recordingUrl ? this.state.recordingUrl : null}
          />
          <br />
          <ButtonGroup
            variant="contained"
            color="primary"
            aria-label="contained primary button group"
          >
            <Button size="small" type="button" id="record" onClick={this.start}>
              Record
            </Button>
            <Button type="button" id="stop" onClick={this.stop}>
              Stop
            </Button>
            {recordingBlob ? (
              <Button
                type="button"
                id="analysis"
                onClick={() => this.props.analyzeClip(this.state.recordingBlob)}
              >
                Analyze
              </Button>
            ) : null}
          </ButtonGroup>
        </div>
      </Container>
    )
  }
}

const mapState = state => {
  return {
    audioData: state.recordingBlob
  }
}

const mapDispatch = dispatch => {
  return {
    recordClip: clip => dispatch(recordClip(clip)),
    analyzeClip: blob => dispatch(analyzeClip(blob))
  }
}

export default connect(mapState, mapDispatch)(Recorder)
