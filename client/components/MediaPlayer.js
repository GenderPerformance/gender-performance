import React from 'react'
const audio = document.createElement('audio')
import {Container, ButtonGroup, Button, Card} from '@material-ui/core'

class MediaPlayer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isPaused: true
    }
  }
  componentDidMount() {
    audio.src = this.props.audioUrl
    audio.load()
  }

  togglePause() {
    if (this.state.isPaused) {
      audio.play()
      this.setState({isPaused: false})
    } else {
      audio.pause()
      this.setState({isPaused: true})
    }
  }
  render() {
    const {isPaused} = this.state
    return (
      <Container>
        <div className="player">
          <div id="player-controls">
            <div className="row center">
              <i
                className={
                  isPaused ? 'fa fa-play-circle' : 'fa fa-pause-circle'
                }
                onClick={() => {
                  this.togglePause()
                }}
              />
            </div>
          </div>
        </div>
      </Container>
    )
  }
}

export default MediaPlayer
