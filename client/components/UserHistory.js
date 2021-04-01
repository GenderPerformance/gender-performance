import React from 'react'
import {
  Container,
  Card,
  Button,
  ButtonGroup
} from '@material-ui/core'
import {fetchHistory} from '../store'
import {connect} from 'react-redux'

class UserHistory extends React.Component {
  componentDidMount() {
    console.log('user id on mount', this.props.user.id)
    this.props.fetchHistory(this.props.user.id)
  }

  /* playRecording(url) {

  } */

  getRecordingDate(dateString) {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]
    const month_index = parseInt(arr[1], 10) - 1
  }

  render() {
    const {history} = this.props
    console.log(this.props)
    return (
      <Container>
        <h1>History is what you make it, Baby</h1>
        {!history ? (
          <h2>Loading History...</h2>
        ) : (
          history.map(recording => {
            return (
              <Card key={recording.id}>
                {console.log('date type', recording.createdAt)}
                <audio controls src={recording.url} />
                <div className="analysis">
                  Female Probability Confidence
                  <strong>{recording.femaleConfidence}%</strong>
                  <br />
                  Male Probability Confidence
                  <strong>{recording.maleConfidence}%</strong>
                  <br />
                </div>
              </Card>
            )
          })
        )}
      </Container>
    )
  }
}

const mapState = state => {
  return {
    //mapping in user and recording state for a loading screen
    user: state.user,
    history: state.user.recordingHistory
  }
}

const mapDispatch = dispatch => {
  return {
    fetchHistory: userId => dispatch(fetchHistory(userId))
  }
}
export default connect(mapState, mapDispatch)(UserHistory)
