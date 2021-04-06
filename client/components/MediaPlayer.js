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
    this.checkEnded=this.checkEnded.bind(this)
  }

  componentDidMount() {
    this.audio.src = this.props.recordingURL
    this.audio.load()
    this.audio.onended = () => {
      this.props.pause();
      this.checkEnded();
    }
  }
  //function to check if we are done playing and update state
  checkEnded(){
    if (
      this.audio.currentTime === 0 ||
      this.audio.currentTime === this.audio.duration
    ) {
      this.props.setEnding(true)
    } else {
      this.props.setEnding(false)
    }
  }
  togglePause() {
    //set the volume to zero if on the resonance chart
    //because waveform is generated from post volume settings
    if (this.props.analysisType === 'reso') {
      this.audio.volume = 0
    } else {
      this.audio.volume = 1
    }

    this.checkEnded()
    //set isEnded state to true if at the beginning or the end.
    //set isEnded state to false if at the middle
    if (
      this.audio.currentTime === 0 ||
      this.audio.currentTime === this.audio.duration
    ) {
      this.props.setEnding(true)
    } else {
      this.props.setEnding(false)
    }

    if (this.props.isPaused) {
      this.props.play()
      this.audio.play()
    } else {
      this.props.pause()
      this.audio.pause()
      this.checkEnded()
    }
  }

  componentDidUpdate(prevProps){
    //check to see if it exists since it will not on some screens
    if(this.props.analysisType){
      //if someone switches analysis mid play, reset the player
      if(prevProps.analysisType!==this.props.analysisType){
        this.audio.pause()
        this.props.pause();
        this.audio.currentTime=0
        this.checkEnded()
      }
    }
  }

  render() {
    const {isPaused} = this.props
    return (
      <Card {...this.props}>
        <div className="player" >
          <Button
            aria-label="play-pause"
            onClick={() => {
              this.togglePause()
            }}
            startIcon={isPaused ? <img className="playbutton" src="play_circle.png" /> : <img className="playbutton" src="pause_circle.png" />}
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
    volume: state.player.volume,
    analysisType: state.analysis.chart
  }
}

const mapDispatch = dispatch => {
  return {
    pause: () => dispatch(pauseRecording()),
    play: () => dispatch(playRecording()),
    setVolume: level => dispatch(volume(level)),
    setEnding: bool => dispatch(setEnd(bool))
  }
}

export default connect(mapState, mapDispatch)(MediaPlayer)
