import {
  RECEIVE_USER_DATA,
  LOGIN,
  LOGOUT
} from '../actions/actionTypes';

const initialState = {
  isAuthenticated: false,
  data: null
};

const user = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_USER_DATA:
      return {
        ...state,
        data: action.payload
      };
    case LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        data: action.payload
      }
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        data: null
      }
    default:
      return state;
  }
};

module.exports = {
  user
};
