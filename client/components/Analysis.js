import React from 'react'
import AudioReactRecorder, {RecordState} from 'audio-react-recorder'
import {Link} from 'react-router-dom'

export default class Recorder extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      recordState: null,
      audioData: null
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
    this.setState({audioData: audioData})
  }

  render() {
    const {recordState} = this.state

    return (
      <div>
        <AudioReactRecorder state={recordState} onStop={this.onStop} />

        <div>
          <audio
            id="audio"
            controls
            src={this.state.audioData ? this.state.audioData.url : null}
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
          <Link to="/analysis">
            <button type="button" id="analysis">
              Analyze
            </button>
          </Link>
        </div>
      </div>
    )
  }
}
