import React from 'react'
import AudioReactRecorder, {RecordState} from 'audio-react-recorder'
import {connect} from 'react-redux'
import MediaPlayer from './MediaPlayer'
import {recordClip, analyzeRecording, clearRecording} from '../store'
import {Link as RouterLink} from 'react-router-dom'
import {Container, ButtonGroup, Button, Card, Link} from '@material-ui/core'
const txtgen = require('txtgen')
const paragraph = txtgen.paragraph()

class Recorder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      recordState: null,
      paragraph: paragraph
    }
    this.newParagraph = this.newParagraph.bind(this)
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
    this.onStop = this.onStop.bind(this)
  }
  componentDidMount() {
    //clear any recording from previous analysis
    this.props.clearRecording()
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

  //audioData contains blob and blobUrl
  onStop(audioData) {
    this.props.recordClip(audioData)
  }

  newParagraph() {
    this.setState({paragraph: txtgen.paragraph()})
  }

  render() {
    const {recordState} = this.state
    const {recordingURL, recordingBlob, userId} = this.props
    if (!this.props.userId) {
      return <div>Loading...</div>
    } else {
      return (
        <Container maxWidth="sm">
          <br />
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
          <div id="recording-prompt">
            <Card
              style={{
                backgroundColor: '#ffe0b2'
              }}
            >
              <h4>RECORD</h4>
              <ButtonGroup
                variant="contained"
                color="secondary"
                aria-label="contained primary button group"
              >
                {recordState === RecordState.START ? (
                  <Button type="button" id="stop" onClick={this.stop}>
                    Stop
                  </Button>
                ) : (
                  <Button
                    size="small"
                    type="button"
                    id="record"
                    onClick={this.start}
                  >
                    Record
                  </Button>
                )}
              </ButtonGroup>
            </Card>
            <br />
            <Card style={{backgroundColor: '#c8e6c7'}}>
              <div className="txtgen">
                Press record then say:
                <h4>{`${this.state.paragraph}`}</h4>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={this.newParagraph}
                >
                  New Paragraph
                </Button>
              </div>
            </Card>
          </div>
          <br />
          <div id="waveform-and-player">
            {recordingBlob && (
              <Link component={RouterLink} to="/Analysis" variant="button">
                <Button
                  style={{
                    backgroundColor: '#c8e6c8'
                  }}
                  type="button"
                  id="analysis"
                  onClick={() =>
                    this.props.analyzeRecording(userId, recordingBlob)
                  }
                >
                  Analyze
                </Button>
              </Link>
            )}
            <br />
            {recordingURL && <MediaPlayer />}
            <AudioReactRecorder
              text-align="center"
              state={recordState}
              onStop={this.onStop}
              backgroundColor="rgb(255,224,177)"
              foregroundColor="rgb(151,180,151)"
              canvasHeight={recordState === RecordState.START ? '100' : '0'}
            />
            <br />
            <br />
          </div>
          <br />
        </Container>
      )
    }
  }
}

const mapState = state => {
  return {
    userId: state.user.id,
    recordingURL: state.player.recordingURL,
    recordingBlob: state.recording.recordingBlob,
    loading: state.loading
  }
}

const mapDispatch = dispatch => {
  return {
    recordClip: blob => dispatch(recordClip(blob)),
    analyzeRecording: (userId, blob) =>
      dispatch(analyzeRecording(userId, blob)),
    clearRecording: () => dispatch(clearRecording())
  }
}

export default connect(mapState, mapDispatch)(Recorder)
