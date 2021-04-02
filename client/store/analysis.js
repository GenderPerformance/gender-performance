//action types
const SET_ANALYSIS_TYPE = 'SET_ANALYSIS_TYPE'

//initial state
const defaultAnalysis = {chart:'spec'}

//action CREATORS
export const setAnalysis = (chart)=>({type:SET_ANALYSIS_TYPE,chart:chart})

//reducer
export default function (state=defaultAnalysis,action){
  switch(action.type){
    case SET_ANALYSIS_TYPE:
      return {...state,chart:action.chart}
    default:
      return state
  }
}
