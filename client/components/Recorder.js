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
      recordingUrl: null
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

  pause = () => {
    this.setState({
      recordState: RecordState.PAUSE
    })
  }

  //audioData contains blob and blobUrl
  onStop = audioData => {
    this.props.recordClip(this.props.userId, audioData.blob)
    this.setState({recordingUrl: audioData.url})
  }

  render() {
    const {recordState, recordingBlob} = this.state

    return (
      <Container maxWidth="sm">
        <div>
          <Card style={{backgroundColor: '#cbae82'}}>
            <h1>Performance</h1>
          </Card>
          <h4>RECORD</h4>
          <AudioReactRecorder
            text-align="center"
            state={recordState}
            onStop={this.onStop}
          />
          {this.props.recordingUrl ? (
            <audio id="audio" controls="controls" preload="none">
              <source src={this.state.recordingUrl} />
            </audio>
          ) : null}
          <br />
          <ButtonGroup
            variant="contained"
            color="primary"
            aria-label="contained primary button group"
          >
            <Button size="small" type="button" id="record" onClick={this.start}>
              Start
            </Button>
            <Button type="button" id="pause" onClick={this.pause}>
              Pause
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
    userId: state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    recordClip: (userId, blob) => dispatch(recordClip(userId, blob)),
    analyzeClip: blob => dispatch(analyzeClip(blob))
  }
}

export default connect(mapState, mapDispatch)(Recorder)
