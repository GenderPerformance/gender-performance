import React from 'react'
import AudioReactRecorder, {RecordState} from 'audio-react-recorder'
import {Link} from 'react-router-dom'
import {useDispatch, connect} from 'react-redux'
import {recordClip, analyzeClip} from '../store'

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

    return (
      <div>
        <AudioReactRecorder state={recordState} onStop={this.onStop} />

        <div>
          <audio
            id="audio"
            controls
            src={this.state.recordingUrl ? this.state.recordingUrl : null}
          />
          <br />
          <button type="button" id="record" onClick={this.start}>
            Start
          </button>
          <button type="button" id="pause" onClick={this.pause}>
            Pause
          </button>
          <button type="button" id="stop" onClick={this.stop}>
            Stop
          </button>
          {recordingBlob ? (
            <Link to="/analysis">
              <button
                type="button"
                id="analysis"
                onClick={() => this.props.analyzeClip(this.state.recordingBlob)}
              >
                Analyze
              </button>
            </Link>
          ) : null}
        </div>
      </div>
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
