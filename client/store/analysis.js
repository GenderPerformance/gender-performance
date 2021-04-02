//action types
const SET_ANALYSIS = 'SET_ANALYSIS'
//initial state
const defaultAnalysis = {chart:null}
//action CREATORS
export const setAnalysis = (chart)=>({type:SET_ANALYSIS,chart:chart})
//reducer
export default function (state=defaultAnalysis,action){
  switch(action.type){
    case SET_ANALYSIS:
      return {...state,chart:action.chart}
    default:
      return state
  }
}
