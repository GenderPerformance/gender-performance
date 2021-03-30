import React from 'react';
import FFT from 'fft.js';
import {connect} from 'react-redux'
import Plot from 'react-plotly.js';
import {myP5} from "./Drawing"





class Fourier extends React.Component {
  constructor() {
    super()
    
  }

  render() {
    const {recordingBlob} = this.props;
    // const size = 256;
    // const f = new FFT(size)
    // const input = new Array(size);
    // console.log("INPUT", input)

    // const out = f.createComplexArray();


    async function getBuff(blob) {
      let result = await  blob.arrayBuffer()
      return result;
    }


    async function work (){
      //let arrBuff;
      const realInput = await recordingBlob.arrayBuffer().then(buffer=> {
        console.log('IT EXISTS', buffer);
      });

      return realInput
    }


    async function getThing(){
      let wow = await work()
      return wow
    }
    let a =  getThing()
    console.log('BUTTER', a)
    // const wut = f.realTransform(out, realInput)
    // console.log('HIHIHIHIHIH',out);
    return (
      <Plot
        data={[
          {
            x: [1, 2, 3],
            y: [2, 6, 3],
            type: 'histogram',
            mode: 'lines+markers',
            marker: {color: 'blue'},
          },
          {type: 'bar', x: [1, 2, 3], y: [2, 5, 3]},
        ]}
        layout={ {width: 320, height: 240, title: 'A Fancy Plot'} }
      />
    );
  }
}








const mapState = state => {
  return {
    recordingURL: state.recording.recordingURL,
    recordingBlob: state.recording.recordingBlob
  }
}

export default connect(mapState)(Fourier)
