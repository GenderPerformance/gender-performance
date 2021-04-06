import React from 'react'
import AudioReactRecorder, {RecordState} from 'audio-react-recorder'
import {connect} from 'react-redux'
import MediaPlayer from './MediaPlayer'
import {
  recordClip,
  analyzeRecording,
  clearRecording,
  setAnalysis
} from '../store'
import {Link as RouterLink} from 'react-router-dom'
import {Container, ButtonGroup, Button, Card, CardContent, Typography, Link} from '@material-ui/core'

const txtgen = require('txtgen')
const paragraph = txtgen.sentence()

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
    //clear analysis state
    this.props.setAnalysis(null)
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
    let sentences = ''
    //randomly generate 1-4 sentences
    for(let i=0; i< Math.floor(Math.random()*3)+1;i++){
      sentences+=txtgen.sentence()+' '
    }
    this.setState({paragraph: sentences})
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
                    Done
                  </Button>
                ) : (<div id="recordstuff">
                    <img src="mic.png" id="micicon" onClick={this.start}/>
                    <Button
                      size="small"
                      type="button"
                      id="record"
                      onClick={this.start}
                    >
                      Record
                    </Button>
                    </div>
                )}
              </ButtonGroup>
            </div>
            <Card className="txtgen" id="phrase">
              <CardContent>
              <Typography color="textSecondary" id='phrase'>
                Press record then say:
              </Typography>
              <Typography color="textSecondary" id="prompt">
                {`${this.state.paragraph}`}
              </Typography>
              <br />
                <Button variant="contained" onClick={this.newParagraph} id='newParagraph'>
                  New Paragraph
                </Button>
              </CardContent>
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
              backgroundColor="rgb(240, 234, 214)"
              foregroundColor="rgb(159,48,226)"
              canvasWidth="450"
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
    clearRecording: () => dispatch(clearRecording()),
    setAnalysis: chart => dispatch(setAnalysis(chart))
  }
}

export default connect(mapState, mapDispatch)(Recorder)
