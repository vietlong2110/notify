import { combineReducers } from 'redux';

import { authenticated } from './auth';
import { DELETE_ALL_STATES } from '../actions/actionTypes';

const appReducer = combineReducers({
  authenticated
});

const rootReducer = (state, action) => {
  if (action.type === DELETE_ALL_STATES)
    state = undefined;
  return appReducer(state, action);
};

export default rootReducer;
