//action types
const SET_DIMENSIONS='SET_DIMENSIONS'

//initial state
const defaultDimensions={height:400,width:600}

//action Creators
export const setDimensions = (h,w) => ({type:SET_DIMENSIONS,h,w})

export default function (state=defaultDimensions,action){
  switch(action.type){
    case SET_DIMENSIONS:
      let newDim = newDimension(action.w)
      return {...state,h:newDim.h,w:newDim.w}
    default:
      return state
  }
}

//dictionary of width cutoff dimensions
const cutoffDimensions = [320,375,411,480,550,600]
//function calculates the minimum h w dimensions based on the
//current window height and width
function newDimension(oldW){
  let h
  let w
  let ratio = 0.666666666
  let menufactor = 50
  //if oldWidth is smaller than the smallest cutoff,
  //return the smallest screen size
  if(oldW<=cutoffDimensions[0]){
    return {h:180,w:270}
  }

  for(let i = 0; i<cutoffDimensions.length;i++){
    if(oldW>cutoffDimensions[i] && i!==cutoffDimensions.length-1){
      if(oldW<=cutoffDimensions[i+1]){
        w = cutoffDimensions[i]
        break;
      }
    } else{
      w=cutoffDimensions[cutoffDimensions.length-1]
    }
  }
  w-=menufactor
  h=Math.round((w)*ratio)
  return {h,w}
}
