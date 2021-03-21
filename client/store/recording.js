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
export const recordClip = clip => ({type: RECORD_CLIP, clip})

/**
 * THUNK CREATORS
 */
export const analyzeClip = blob => async dispatch => {
  try {
    const formData = new FormData()
    formData.append('soundBlob', blob)
    console.log('formData,blob', formData, blob)
    //const {data} = await axios.post('http://localhost:4000/api/sound', formData)
    //const result = await axios.post('http://localhost:4000/api/sound', ['text'])
    const result = await axios.post('api/recordings/upload', formData)
    console.log('results', result)
    const prediction = result.prediction
    dispatch(_analyzeClip(prediction))
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
