import React from 'react'
import AudioReactRecorder, {RecordState} from 'audio-react-recorder'
import {connect} from 'react-redux'
import {Link as RouterLink} from 'react-router-dom'
import {recordClip, analyzeClip} from '../store'
import {Container, ButtonGroup, Button, Card, Link} from '@material-ui/core'
import MenuBar from './MenuBar'
const txtgen = require('txtgen')
const paragraph = txtgen.paragraph()

class Recorder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      recordState: null,
      paragraph: paragraph,
      blob: null
    }

    this.newParagraph = this.newParagraph.bind(this)
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

  //audioData contains blob and blobUrl
  onStop = audioData => {
    this.props.recordClip(audioData)
    this.setState({blob: audioData})
  }

  newParagraph() {
    this.setState({paragraph: txtgen.paragraph()})
  }

  render() {
    console.log('State:', this.state)
    const {recordState} = this.state
    const {recordingURL, recordingBlob, userId} = this.props
    if (!this.props.userId) {
      return <div>Loading...</div>
    } else {
      return (
        <Container className="recordPage">
          <Container className="recordButtonParagraph">
            <ButtonGroup
              variant="contained"
              color="secondary"
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
              {this.state.blob ? (
                <Link component={RouterLink} to="/Analysis" variant="button">
                  <Button
                    style={{
                      backgroundColor: '#c8e6c8'
                    }}
                    type="button"
                    id="analysis"
                    onClick={() => {
                      this.props.analyzeClip(userId, recordingBlob)
                      this.setState({blob: null})
                    }}
                  >
                    Analyze
                  </Button>
                </Link>
              ) : null}
            </ButtonGroup>
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
          </Container>
          <Card>
            <AudioReactRecorder
              state={recordState}
              onStop={this.onStop}
              backgroundColor="rgb(255,224,177)"
              foregroundColor="rgb(151,180,151)"
              canvasHeight="100"
            />
            <audio
              id="audio"
              controls={recordingURL}
              src={recordingURL ? recordingURL : null}
            />
          </Card>
        </Container>
      )
    }
  }
}

const mapState = state => {
  return {
    userId: state.user.id,
    recordingURL: state.recording.recordingURL,
    recordingBlob: state.recording.recordingBlob,
    loading: state.loading
  }
}

const mapDispatch = dispatch => {
  return {
    recordClip: blob => dispatch(recordClip(blob)),
    analyzeClip: (userId, blob) => dispatch(analyzeClip(userId, blob))
  }
}

export default connect(mapState, mapDispatch)(Recorder)
