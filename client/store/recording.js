import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const ANALYZE_CLIP = 'ANALYZE_CLIP'
const REMOVE_CLIP = 'REMOVE_CLIP'
const RECORD_CLIP = 'RECORD_CLIP'
const IS_LOADING = 'IS_LOADING'

/**
 * INITIAL STATE
 */
const defaultState = {
  recordingBlob: {},
  recordingURL: '',
  prediction: null,
  loading: false
}

/**
 * ACTION CREATORS
 */
const _analyzeClip = prediction => ({type: ANALYZE_CLIP, prediction})
const _isLoading = loading => ({type: IS_LOADING, loading})
const removeClip = () => ({type: REMOVE_CLIP})
export const recordClip = clip => ({type: RECORD_CLIP, clip})

/**
 * THUNK CREATORS
 */
export const analyzeClip = blob => async dispatch => {
  try {
    dispatch(_isLoading(true))
    const formData = new FormData()
    formData.append('soundBlob', blob, 'recording.wav')
    const {data} = await axios.post('/api/recordings/upload', formData)
    dispatch(_analyzeClip(data))
    dispatch(_isLoading(false))
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
    case IS_LOADING:
      return {...state, loading: action.loading}
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
