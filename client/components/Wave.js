import React from 'react';
import { connect } from 'react-redux';
import WaveSurfer from 'wavesurfer.js';
import {
  Container,
  Card,
  CircularProgress,
  Button,
  ButtonGroup,
} from '@material-ui/core';
import MediaPlayer from './MediaPlayer';

class Wave extends React.Component {
  constructor() {
    super();
    this.state = {
      wavesurfer: null,
    };
  }

  componentDidMount() {
    if (!this.state.wavesurfer) {
      const wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: 'green',
        progressColor: 'purple',
        plugins: [],
      });
      this.setState({ wavesurfer: wavesurfer });
    }
  }

  render() {
    if (this.props.prediction) {
      const wavesurf = this.state.wavesurfer;
      if (this.props.recordingURL !== null && wavesurf !== null) {
        wavesurf.load(this.props.recordingURL);
      }
    }
    return (
      <Container>
        {this.props.recordingURL && <MediaPlayer />}
        <ButtonGroup
          variant='contained'
          aria-label='contained primary button group'
        >
          <Button onClick={() => this.state.wavesurfer.playPause()}>
            Play/Pause
          </Button>
        </ButtonGroup>
      </Container>
    );
  }
}

const mapState = (state) => {
  return {
    //mapping in user and recording state for a loading screen
    user: state.user,
    recordingURL: state.player.recordingURL,
    recordingBlob: state.recording.recordingBlob,
    loading: state.recording.loading,
    prediction: state.recording.prediction,
  };
};

export default connect(mapState)(Wave);
