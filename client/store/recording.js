import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const ANALYZE_CLIP = 'ANALYZE_CLIP'
const REMOVE_CLIP = 'REMOVE_CLIP'
const RECORD_CLIP = 'RECORD_CLIP'

/**
 * INITIAL STATE
 */
const defaultState = {recordingBlob: null, recordingURL: '', prediction: null}

/**
 * ACTION CREATORS
 */
const _analyzeClip = recordingData => ({type: ANALYZE_CLIP, recordingData})
const removeClip = () => ({type: REMOVE_CLIP})
export const recordClip = recordingData => ({type: RECORD_CLIP, recordingData})

/**
 * THUNK CREATORS
 */
export const analyzeClip = (userId, blob) => async dispatch => {
  try {
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
    formData.append('soundBlob', blob, fileName)
    //analyze
    const {data} = await axios.post('/api/recordings/analyze', formData)
    //log prediction
    console.log(data)
    const prediction = data.prediction
    const audioData = {
      s3Url: url,
      prediction
    }
    dispatch(_analyzeClip(audioData))
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
    case RECORD_CLIP:
      return {
        recordingBlob: action.recordingData.blob,
        recordingURL: action.recordingData.url,
        prediction: null
      }
    case REMOVE_CLIP:
      return defaultState
    default:
      return state
  }
}
