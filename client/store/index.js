import {createStore, combineReducers, applyMiddleware} from 'redux'
import {createLogger} from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import recording from './recording'
import user from './user'
import player from './player'
import analysis from './analysis'
import chartSize from './chartSize'
import switches from './switches'

const reducer = combineReducers({user, recording, player, analysis, chartSize,switches})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './recording'
export * from './player'
export * from './analysis'
export * from './chartSize'
export * from './switches'
