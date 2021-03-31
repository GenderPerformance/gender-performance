import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const ANALYZE_CLIP = 'ANALYZE_CLIP'
const RECORD_CLIP = 'RECORD_CLIP'
const IS_LOADING = 'IS_LOADING'

/**
 * INITIAL STATE
 */
const defaultState = {
  recordingBlob: null,
  recordingURL: '',
  prediction: null,
  loading: false,
  recordingHistory: []
}

/**
 * ACTION CREATORS
 */
const _analyzeClip = recordingData => ({type: ANALYZE_CLIP, recordingData})
const _isLoading = loading => ({type: IS_LOADING, loading})
export const recordClip = recordingData => ({type: RECORD_CLIP, recordingData})
const _fetchHistory = userHistory => ({type: FETCH_HISTORY, userHistory})

/**
 * THUNK CREATORS
 */
export const analyzeClip = (userId, blob) => async dispatch => {
  try {
    dispatch(_isLoading(true))
    //create file ref in db
    const res = await axios.post('api/recordings/upload')
    const fileName = res.data

    //upload file to S3
    const clip = new File([blob], fileName)
    const response = await axios.get(
      `/auth/aws/s3-sign?file-name=${clip.name}&file-type=${clip.type}`
    )
    const {signedUrl, url} = response.data

    const s3response = await axios.put(signedUrl, clip)

    //prepare file for analysis
    const formData = new FormData()
    formData.append('s3Url', url)
    formData.append('soundBlob', blob, fileName)
    //analyze
    const result = await axios.post('/api/recordings/analyze', formData)
    //log prediction
    const prediction = result.data
    const audioData = {
      s3Url: url,
      prediction
    }
    dispatch(_analyzeClip(audioData))
    dispatch(_isLoading(false))
  } catch (error) {
    console.error(error)
  }
}

export const fetchHistory = userId => async dispatch => {
  try {
    console.log('fetching history?')
    const response = await axios.get(`/api/recordings/user/${userId}`)
    console.log('🚀 ~ file: recording.js ~ line 73 ~ response', response)
    const userHistory = response.data
    dispatch(_fetchHistory(userHistory))
  } catch (error) {
    console.error(error)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultState, action) {
  switch (action.type) {
    case ANALYZE_CLIP:
      return {
        ...state,
        recordingURL: action.recordingData.s3Url,
        prediction: action.recordingData.prediction
      }
    case IS_LOADING:
      return {...state, loading: action.loading}
    case RECORD_CLIP:
      return {
        recordingBlob: action.recordingData.blob,
        recordingURL: action.recordingData.url,
        prediction: null
      }
    case FETCH_HISTORY:
      return {
        ...state,
        recordingHistory: action.userHistory
      }
    default:
      return state
  }
}
