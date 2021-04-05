import React from 'react'
import {Container, Card, CardContent, Typography} from '@material-ui/core'
import {fetchHistory} from '../store'
import {connect} from 'react-redux'

class UserHistory extends React.Component {
  componentDidMount() {
    this.props.fetchHistory(this.props.user.id)
  }

  getRecordingDate = dateString => {
    const parsed = new Date(Date.parse(dateString))
    return parsed.toLocaleString()
  }

  render() {
    const {history} = this.props
    return (
      <Container>
        <Typography variant="h4" id="history">
          Recording History
        </Typography>
        <br />
        {!history ? (
          <Typography variant="h5">Loading History...</Typography>
        ) : (
          history.map(recording => {
            return (
              <div key={recording.id}>
                <Card>
                  <div id="indivHistory">
                    <div id="recording-details">
                      <Typography variant="h6">Date</Typography>
                      <Typography>
                        {this.getRecordingDate(recording.createdAt)}
                      </Typography>
                      <audio controls src={recording.url} />
                    </div>
                    <CardContent className="prediction-results">
                      <Typography variant="h6">Prediction Results</Typography>
                      <div>
                        <Typography>
                          Feminine -- {recording.femaleConfidence}%
                        </Typography>
                      </div>
                      <div>
                        <Typography>
                          Masculine -- {recording.maleConfidence}%
                        </Typography>
                      </div>
                    </CardContent>
                    <br />
                  </div>
                </Card>
                <br />
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
