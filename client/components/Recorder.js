import React from 'react'
import AudioReactRecorder, {RecordState} from 'audio-react-recorder'
import {connect} from 'react-redux'
import MediaPlayer from './MediaPlayer'
import {recordClip, analyzeRecording, clearRecording} from '../store'
import {Link as RouterLink} from 'react-router-dom'
import {Container, ButtonGroup, Button, Card, Link} from '@material-ui/core'
import MenuBar from './MenuBar'
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
        <Container className="recordPage">
          <Container className="recordButtonParagraph">
            <div id="record-buttons">
              <ButtonGroup
                variant="contained"
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
            </div>
            <Card className="txtgen">
              Press record then say:
              <h4>{`${this.state.paragraph}`}</h4>
              <Button variant="contained" onClick={this.newParagraph}>
                New Paragraph
              </Button>
            </Card>
          </Container>
          <div className="analyze">
            {recordingBlob && (
              <Link component={RouterLink} to="/Analysis" variant="button">
                <Button
                  style={{}}
                  variant="contained"
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
          </div>
          <br />
          <div className="audio">
            {recordingURL && <MediaPlayer />}
            <AudioReactRecorder
              text-align="center"
              state={recordState}
              onStop={this.onStop}
              backgroundColor="rgb(255,255,255)"
              foregroundColor="rgb(159,48,226)"
              canvasWidth="900"
              canvasHeight={recordState === RecordState.START ? '150' : '0'}
            />
          </div>
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
