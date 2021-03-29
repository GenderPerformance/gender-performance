import React from 'react'
import AudioReactRecorder, {RecordState} from 'audio-react-recorder'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {Container, ButtonGroup, Button, Card} from '@material-ui/core'

class MediaPlayer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      url: props.audioUrl
    }
  }

  render() {
    const {url} = this.state
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
          <div className="player">
            <audio id="audio" controls src={url} />
            <br />
          </div>
        </Card>
      </Container>
    )
  }
}

const mapState = state => {
  return {}
}

const mapDispatch = dispatch => {
  return {}
}

export default connect(mapState, mapDispatch)(MediaPlayer)
