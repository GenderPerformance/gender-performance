import history from '../history'

/**
 * ACTION TYPES
 */
const RECORD_CLIP = 'RECORD_CLIP'
const PLAY_RECORDING = 'PLAY_RECORDING'
const PAUSE_RECORDING = 'PAUSE_RECORDING'
const CLEAR_RECORDING = 'CLEAR_RECORDING'

/**
 * INITIAL STATE
 */
const defaultState = {
  recordingURL: null,
  paused: true
}

/**
 * ACTION CREATORS
 */
export const playRecording = () => ({type: PLAY_RECORDING})
export const pauseRecording = () => ({type: PAUSE_RECORDING})

/**
 * THUNK CREATORS
 */

/**
 * REDUCER
 */
export default function(state = defaultState, action) {
  switch (action.type) {
    case RECORD_CLIP:
      return {
        ...state,
        recordingURL: action.recordingData.url
      }
    case PAUSE_RECORDING:
      return {
        ...state,
        paused: true
      }
    case PLAY_RECORDING:
      return {
        ...state,
        paused: false
      }
    case CLEAR_RECORDING:
      return defaultState

    default:
      return state
  }
}
