import React from 'react';
import { connect } from 'react-redux';
import WaveSurfer from 'wavesurfer.js';
import { Fade } from '@material-ui/core'
import {
  Container,
  Button,
} from '@material-ui/core';
import {setAnalysis} from '../store'


class WaveForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      wavesurfer: null,
    };
    this.handlePlayback=this.handlePlayback.bind(this)
  }

  componentDidMount() {
    this.props.setAnalysis('wave')
    if (!this.state.wavesurfer) {
      const wavesurfer = WaveSurfer.create({
        container: '#waveform',
        waveColor: '#9F30E2',
        progressColor: '#3B2945',
        barWidth: 0.6,
        barHeight:1,
        width:this.props.chartWidth?this.props.chartWidth:600,
        height:this.props.chartHeight?this.props.chartHeight:400,
        responsive:true,
        scrollParent:false,
        fillParent:true,
        plugins: [],
      });
      wavesurfer.setVolume(0.0)
      this.setState({ wavesurfer: wavesurfer });
    }
    //resize dimensions
    let canvas = document.getElementById('waveform')
    canvas.style.height = `${this.props.chartHeight}px`
    canvas.style.width = `${this.props.chartWidth}px`
  }

  componentWillUnmount(){
  //stop and reset this player if we move away from this component
  this.state.wavesurfer.pause()
  this.state.wavesurfer.currentTime=0
  }

  handlePlayback() {
    this.state.wavesurfer.playPause()
  }

  //set props if component is already mounted and we somehow left and came back
  //play if we hit play on mediaplayer and pause if we hit pause
  componentDidUpdate(prevProps){
    if(prevProps.chartHeight!==this.props.chartHeight&&this.state.wavesurfer){
      //resize dimensions
      let canvas = document.getElementById('waveform')
      canvas.style.height = `${this.props.chartHeight}px`
      canvas.style.width = `${this.props.chartWidth}px`
    }

    if(this.props.analysisType!=='wave'&&this.props.getAnalysisType){
      this.props.setAnalysis('wave')
    }
    if(this.props.analysisType==='wave'){
      if (
        prevProps.isPaused !== this.props.isPaused &&
        this.props.isPaused === true
      ) {
        this.state.wavesurfer.pause()
      } else if (
        prevProps.isPaused !== this.props.isPaused &&
        this.props.isPaused === false
      ) {
        this.state.wavesurfer.play()
      }
    }
  }

  render() {
    if (this.props.recordingURL) {
      const wavesurf = this.state.wavesurfer;
      if (wavesurf !== null && wavesurf.getDuration()===0) {
        wavesurf.load(this.props.recordingURL);
      }
    }
    return (
      <Container {...this.props}>
        <Fade in timeout={400}>
          <div id="waveform"/>
        </Fade>
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
    analysisType: state.analysis.chart,
    isPaused: state.player.isPaused,
    chartHeight: state.chartSize.h,
    chartWidth: state.chartSize.w
  };
};

const mapDispatch = dispatch => {
  return {
    setAnalysis: chartName => dispatch(setAnalysis(chartName))
  }
}

export default connect(mapState,mapDispatch)(WaveForm);
