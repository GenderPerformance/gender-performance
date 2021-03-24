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
const defaultState = {recordingBlob: {}, recordingURL: '', prediction: null}

/**
 * ACTION CREATORS
 */
const _analyzeClip = prediction => ({type: ANALYZE_CLIP, prediction})
const removeClip = () => ({type: REMOVE_CLIP})
export const _recordClip = clip => ({type: RECORD_CLIP, clip})

/**
 * THUNK CREATORS
 */
export const analyzeClip = blob => async dispatch => {
  try {
    const formData = new FormData()
    formData.append('soundBlob', blob, 'recording.wav')
    //analyze
    const {data} = await axios.post('/api/recordings/analyze', formData)
    console.log(data)
    const prediction = data.prediction
    dispatch(_analyzeClip(prediction))
  } catch (error) {
    console.error(error)
  }
}

export const recordClip = (userId, blob) => async dispatch => {
  try {
    const clip = new File([blob], `user-${userId}-test.wav`)
    const response = await axios.get(
      `/auth/aws/s3-sign?file-name=${clip.name}&file-type=${clip.type}`
    )
    const {signedUrl, url} = response.data

    const s3response = await axios.put(signedUrl, clip)

    console.log('🚀 ~ file: recording.js ~ line 48 ~ s3response', s3response)

    dispatch(_recordClip({url: url}))
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
      return {...state, prediction: action.prediction}
    case RECORD_CLIP:
      return {
        recordingBlob: action.clip.blob,
        recordingURL: action.clip.url,
        prediction: null
      }
    case REMOVE_CLIP:
      return defaultState
    default:
      return state
  }
}
