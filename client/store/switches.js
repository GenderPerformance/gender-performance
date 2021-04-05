//for triggering material UI effects

//action types
const SET_MEDIA_PLAYER_FADE_TRUE = 'SET_MEDIA_PLAYER_FADE_TRUE'
const SET_MEDIA_PLAYER_FADE_FALSE = 'SET_MEDIA_PLAYER_FADE_FALSE'
//initial state
const defaultSwitches = {mediaPlayerFade:true}

//action Creators
export const mediaPlayerFadeTrue =()=>({type:SET_MEDIA_PLAYER_FADE_TRUE})
export const mediaPlayerFadeFalse =()=>({type:SET_MEDIA_PLAYER_FADE_FALSE})

//reducer
export default function (state=defaultSwitches,action){
  switch(action.type){
    case SET_MEDIA_PLAYER_FADE_TRUE:
      return {...state,mediaPlayerFade:true}
    case SET_MEDIA_PLAYER_FADE_FALSE:
      return {...state,mediaPlayerFade:false}
    default:
      return state
  }
}
