import React from 'react'
import {Container, Card} from '@material-ui/core'
import {connect} from 'react-redux'
import colormap from 'colormap'
import WaveSurfer from 'wavesurfer.js'
import SpectrogramPluginMin from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram.min.js'
import SpectrogramPluginReg from 'wavesurfer.js/dist/plugin/wavesurfer.spectrogram.js'
import Spectrogram from 'spectrogram'

class Analysis extends React.Component {
  render() {
    if (!this.props.recording) {
      return <div>Loading...</div>
    } else {
      const colors = colormap({
        colormap: 'hot',
        nshades: 256,
        format: 'float'
      })
      //const SpectrogramPlugin = window.WaveSurfer.spectrogram
      const wavesurfer = WaveSurfer.create({
        container: '#waveform',
        mediaControls: true
        // barWidth: 1,
        // barHeight: 4, // the height of the wave
        // barGap: null,
        // plugins: [
        //   SpectrogramPluginReg.create({
        //     wavesurfer: wavesurfer,
        //     container: "#waveform-spectrogram",
        //     labels:true,
        //     pixelRatio: 1.15,
        //     colormap:[]
        //   })
        // ]
      })
      //create low pass filter to cut off
      const lowpass = wavesurfer.backend.ac.createBiquadFilter()
      //lowpass.frequency.value=8000
      lowpass.frequency.value = 8000

      //lowpass.frequency.setValueAtTime(4000,wavesurfer.backend.ac.currentTime)

      wavesurfer.backend.setFilter(lowpass)

      //load in audio data to be processed
      wavesurfer.load(this.props.recording.recordingURL)

      const spectro = Spectrogram(
        document.getElementById('waveform-spectrogram'),
        {
          // audio: {
          //   enable: false
          // }
        }
      )

      const audioContext = new AudioContext()
      //var request = new XMLHttpRequest();
      //request.open('GET', 'audio.mp3', true);
      //request.responseType = 'arraybuffer';
      spectro.connectSource(
        Buffer.from(new Uint8Array(this.props.recording.recordingURL)),
        audioContext
      )
      spectro.start()

      return (
        <Container maxWidth="sm">
          <div>
            <br />
            <br />
            <Card style={{backgroundColor: '#cbae82'}}>
              <h4>Analysis</h4>
              <p>
                Lorem ipsum dolor sit amet, consecteturadipiscing elit. Donec
                viverra eget nullavitae ornare.
              </p>
            </Card>
            <button onClick={() => wavesurfer.playPause()}>play/pause</button>
          </div>
        </Container>
      )
    }
  }
}

const mapState = state => {
  return {
    //mapping in user and recording state for a loading screen
    user: state.user,
    recording: state.recording,
    //what is audioData supposed to be?
    audioData: state.recordingBlob
  }
}
export default connect(mapState)(Analysis)
