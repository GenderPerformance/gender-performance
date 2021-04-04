import axios from 'axios'

/**
 * ACTION TYPES
 */
const ANALYZE_RECORDING = 'ANALYZE_RECORDING'
const RECORD_CLIP = 'RECORD_CLIP'
const IS_LOADING = 'IS_LOADING'
const CLEAR_RECORDING = 'CLEAR_RECORDING'

/**
 * INITIAL STATE
 */
const defaultState = {
  recordingBlob: null,
  prediction: null,
  loading: false
}

/**
 * ACTION CREATORS
 */
const _analyzeRecording = recordingData => ({
  type: ANALYZE_RECORDING,
  recordingData
})
const _isLoading = loading => ({type: IS_LOADING, loading})
export const recordClip = recordingData => ({type: RECORD_CLIP, recordingData})
export const clearRecording = () => ({type: CLEAR_RECORDING})

/**
 * THUNK CREATORS
 */
export const analyzeRecording = (userId, blob) => async dispatch => {
  try {
    dispatch(_isLoading(true))
    //create file ref in db
    const res = await axios.post('api/recordings/upload')
    const fileName = res.data
    //direct user to url.com/analysis/user/3/recording/48
    //upload file to S3
    const clip = new File([blob], fileName)
    const response = await axios.get(
      `/auth/aws/s3-sign?file-name=${clip.name}&file-type=${clip.type}`
    )
    const {signedUrl, url} = response.data

    await axios.put(signedUrl, clip)

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
    dispatch(_analyzeRecording(audioData))
    dispatch(_isLoading(false))
  } catch (error) {
    if(error.includes('503')){
      dispatch(_analyzeRecording({s3URL:url,prediction:{mp:"<error:not enough resources>",fp:"<please try again later>"}}))
    }
    console.error(error)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultState, action) {
  switch (action.type) {
    case ANALYZE_RECORDING:
      return {
        ...state,
        prediction: action.recordingData.prediction
      }
    case IS_LOADING:
      return {...state, loading: action.loading}
    case RECORD_CLIP:
      return {
        recordingBlob: action.recordingData.blob,
        prediction: null
      }
    case CLEAR_RECORDING:
      return defaultState
    default:
      return state
  }
}
