import React from 'react'
import {connect} from 'react-redux'
import {playRecording, pauseRecording} from '../store'
const audio = document.createElement('audio')
import {Button, Card} from '@material-ui/core'
import {PauseCircleFilled, PlayCircleFilled} from '@material-ui/icons'

class MediaPlayer extends React.Component {
  componentDidMount() {
    audio.src = this.props.recordingURL
    audio.load()
    audio.onended = () => this.props.pause()
  }

  togglePause() {
    if (this.props.isPaused) {
      this.props.play()
      audio.play()
    } else {
      this.props.pause()
      audio.pause()
    }
  }

  render() {
    const {isPaused} = this.props
    return (
      <Card>
        <div className="player">
          <Button
            aria-label="play-pause"
            onClick={() => {
              this.togglePause()
            }}
            startIcon={isPaused ? <PlayCircleFilled /> : <PauseCircleFilled />}
          />
        </div>
      </Card>
    )
  }
}

const mapState = state => {
  return {
    recordingURL: state.player.recordingURL,
    isPaused: state.player.isPaused
  }
}

const mapDispatch = dispatch => {
  return {
    pause: () => dispatch(pauseRecording()),
    play: () => dispatch(playRecording())
  }
}

export default connect(mapState, mapDispatch)(MediaPlayer)