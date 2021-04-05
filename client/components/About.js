import React from 'react'
import {Link} from 'react-router-dom'
import {connect} from 'react-redux'
import {Card} from '@material-ui/core'

const About = props => {
  return (
    <React.Fragment>
      <div id="about">
      <Card>
        <div id="aboutText">
          <p>
            Welcome to our little project - Voice Performance. Designed as a proof
            of concept for an application to help individuals understand how their
            voice may be perceived, we use machine learning and audio analysis to
            generate a gender perception based on a recording.
          </p>
          <p>
            The machine learning model was trained with regular speaking voices and
            thus to designed to be used for regular speaking voices. It is a feed
            forward network with 5 hidden layers using relu nodes.
          </p>
          <p>
            Labeling gender is inherently reductive and doesn't take into the
            broad spectrum of genders that exist in the world. In this, the
            application demonstrates some of the limitations of machine learning
            and data classification. Our goal is not to enforce the binary
            further, but to hopefully provide a tool that can help individuals
            improve their gender performance. We're not there yet, but we hope to
            be one day.
          </p>
          <p>
            This project was built using React/Redux on the frontend and Node.js
            and Python on the backend. The original Tensorflow machine learning
            model was built by XXXXX. Audio analysis is performed using the MDN
            Web Audio API and X and Y libraries.
          </p>
        </div>
      </Card>
    </div>
    </React.Fragment>
  )
}

export default About
