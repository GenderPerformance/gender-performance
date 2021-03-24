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
        <Card
          style={{
            backgroundColor: '#cbae82',
            paddingLeft: '2em',
            paddingRight: '2em'
          }}
        >
          <h1>Performance</h1>
        </Card>
        <br />
        <Card style={{backgroundColor: '#ffe0b2'}}>
          <div className="recorder">
            <AudioReactRecorder
              text-align="center"
              state={recordState}
              onStop={this.onStop}
              backgroundColor="rgb(255,255,255)"
              foregroundColor="rgb(203,174,129)"
            />
            <audio
              id="audio"
              controls
              src={this.state.recordingUrl ? this.state.recordingUrl : null}
            />
            <br />
            <ButtonGroup
              variant="contained"
              color="inherit"
              aria-label="contained primary button group"
            >
              <Button
                size="small"
                type="button"
                id="record"
                onClick={this.start}
              >
                Record
              </Button>
              <Button type="button" id="stop" onClick={this.stop}>
                Stop
              </Button>
              {recordingBlob ? (
                <Button
                  type="button"
                  id="analysis"
                  onClick={() =>
                    this.props.analyzeClip(this.state.recordingBlob)
                  }
                >
                  Analyze
                </Button>
              ) : null}
            </ButtonGroup>
            <br />
          </div>
        </Card>
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
