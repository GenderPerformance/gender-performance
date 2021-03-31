import React from 'react'
import {connect} from 'react-redux'
import {Button} from '@material-ui/core'

import P5Wrapper from 'react-p5-wrapper'
import '../../node_modules/p5/lib/addons/p5.sound'
import '../../node_modules/p5/lib/addons/p5.dom'
import p5 from 'p5'
import Meyda from 'meyda'
import { XYFrame } from "semiotic"
import { Chart } from 'react-charts'
import {Line} from 'react-chartjs-2';
import FourierArray from './FourierArray'
import Waveform from "react-audio-waveform"

const set = {
  labels: ["label1", "label2", "label3"],
  datasets: [
    {
      label: 'Label1',
      fill: false,
      lineTension:0.001,
      backgroundColor: 'rgba(75,192,192,1)',
      borderColor: 'rgba(0,0,0,1)',
      data: FourierArray
    }
  ]
}




//4096
let counter = 1
const toRender = FourierArray.map((elem)=> {
  return {
    x: counter++,
    y:elem
  }
})




function Drawing() {
  const data = React.useMemo(
    () => [
      {
        label: 'Series 1',
        data: toRender
      },
    ],
    []
  )

  const axes = React.useMemo(
    () => [
      { primary: true, type: 'linear', position: 'bottom' },
      { type: 'linear', position: 'left' }
    ],
    []
  )
    console.log("TORENDER", toRender)
  return (

    <div
      style={{
        width: '400px',
        height: '300px'
      }}
    >
      <Chart data={data} axes={axes} />
    </div>
  )
}



const mapState = state => {
  return {
    fourier: state.recording.fourierArray,
    recordingURL: state.recording.recordingURL,
    recordingBlob: state.recording.recordingBlob
  }
}

export default connect(mapState)(Drawing)
