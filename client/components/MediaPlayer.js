import React from 'react'
import {connect} from 'react-redux'
import {playRecording, pauseRecording, setEnd} from '../store'
import {Button, Card} from '@material-ui/core'
import {PauseCircleFilled, PlayCircleFilled} from '@material-ui/icons'

class MediaPlayer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      url: this.props.recordingURL,
      paused: true
    }
    this.audio = document.createElement('audio')
  }

  componentDidMount() {
    this.audio.src = this.props.recordingURL
    this.audio.load()
    this.audio.onended = () => this.props.pause()
  }

  togglePause() {
    //set the volume to zero if on the resonance chart
    //because waveform is generated from post volume settings
    if(this.props.analysis==='reso'){
      this.audio.volume=0
    } else{
      this.audio.volume=1
    }
    //set isEnded state to true if at the beginning or the end.
    //set isEnded state to false if at the middle
    if(this.audio.currentTime===0||this.audio.currentTime===this.audio.duration){
      this.props.setEnding(true)
    } else{
      this.props.setEnding(false)
    }

    if (this.props.isPaused) {
      this.props.play()
      this.audio.play()
    } else {
      this.props.pause()
      this.audio.pause()
    }
  }

  render() {
    console.log('media render',this.props)
    console.log(this.audio.currentTime,this.audio.duration,this.audio.isPaused,this.audio.ended)
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
    isPaused: state.player.isPaused,
    isEnded: state.player.isEnded,
    volume:state.player.volume,
    analysis:state.analysis.chart,
  }
}

const mapDispatch = dispatch => {
  return {
    pause: () => dispatch(pauseRecording()),
    play: () => dispatch(playRecording()),
    setVolume:(level)=>dispatch(volume(level)),
    setEnding: (bool) => dispatch(isEnded(bool))
  }
}

export default connect(mapState, mapDispatch)(MediaPlayer)
