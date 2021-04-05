import React from 'react'
import {
  Container,
  Card,
  CardContent
} from '@material-ui/core'
import {fetchHistory} from '../store'
import {connect} from 'react-redux'

class UserHistory extends React.Component {
  componentDidMount() {
    console.log('user id on mount', this.props.user.id)
    this.props.fetchHistory(this.props.user.id)
  }

  getRecordingDate = (dateString) => {
    const parsed = new Date(Date.parse(dateString));
    return parsed.toLocaleString()
  }

  render() {
    const {history} = this.props
    return (
      <Container>
        <h1 id='history'>Recording History</h1>
        {!history ? (
          <h2>Loading History...</h2>
        ) : (
          history.map(recording => {
            return (
              <div>
                <Card key={recording.id}>
                  <div id="indivHistory">
                    <div id="recording-details">
                      <h4>Date</h4>
                      <p>{this.getRecordingDate(recording.createdAt)}</p>
                      <audio controls src={recording.url} />
                    </div>
                    <CardContent className="prediction-results">
                      <h4>Prediction Results</h4>
                      <div>
                      <span>Feminine -- </span>
                      <span><strong>{recording.femaleConfidence}%</strong></span>
                      </div>
                      <div>
                        <span>Masculine -- </span>
                      <span><strong>{recording.maleConfidence}%</strong></span>
                      </div>
                    </CardContent>
                    <br/>
                  </div>
                </Card>
              <br/>
              </div>
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
