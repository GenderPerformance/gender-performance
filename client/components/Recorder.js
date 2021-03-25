import React from 'react'
import AudioReactRecorder, {RecordState} from 'audio-react-recorder'
import {Link} from 'react-router-dom'
import {useDispatch, connect} from 'react-redux'
import {recordClip, analyzeClip, _isLoading} from '../store'
import {
  Container,
  ButtonGroup,
  Button,
  Card,
  CircularProgress
} from '@material-ui/core'
import Analysis from './Analysis'

class Recorder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      recordState: null,
      recordingUrl: null,
      recordingBlob: null
    }
  }
  componentDidMount() {
    console.log('compoenent did mount', this.props)
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
    console.log('audioData', audioData)
    this.setState({recordingBlob: audioData.blob, recordingUrl: audioData.url})
    this.props.recordClip(audioData)
  }

  render() {
    const {recordState, recordingBlob} = this.state
    console.log('render props', this.props)
    if (!this.props.user) {
      console.log(this.props.user)
      return <div>Loading...</div>
    } else {
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
              <Button
                size="small"
                type="button"
                id="record"
                onClick={this.start}
              >
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
                  onClick={() =>
                    this.props.analyzeClip(this.state.recordingBlob)
                  }
                >
                  Analyze
                </Button>
              ) : null}
            </ButtonGroup>
            {this.props.recording.recordingURL ? <Analysis /> : <div />}
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
    audioData: state.recordingBlob,
    loading: state.loading
  }
}

const mapDispatch = dispatch => {
  return {
    recordClip: clip => dispatch(recordClip(clip)),
    analyzeClip: blob => dispatch(analyzeClip(blob))
  }
}

export default connect(mapState, mapDispatch)(Recorder)
