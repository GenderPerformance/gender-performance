import React from 'react'
import {Container, Card} from '@material-ui/core'

export class Recorder extends React.Component {
  render() {
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
        </div>
      </Container>
    )
  }
}
