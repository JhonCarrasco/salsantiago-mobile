import { combineReducers, createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import * as reducers from './redux/reducers'

export default createStore(combineReducers({
    ...reducers,
  }), applyMiddleware(thunk))