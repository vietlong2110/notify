import {
  REQUEST_FACEBOOK_ACCESS_TOKEN,
  RECEIVE_SERVER_DATA,
  ERROR_AUTH,
  LOAD_AUTH_STATE,
  SET_AUTH_STATE,
  LOGGING_OUT
} from '../actions/actionTypes';

const initialState = {
  isAuthenticated: false,
  isPending: false,
  error: null,
  data: null
};

const authenticated = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_AUTH_STATE:
      return {
        ...state,
        isPending: true
      }
    case SET_AUTH_STATE:
      return {
        ...state,
        isPending: false,
        isAuthenticated: action.payload.auth,
        data: action.payload.data
      };
    case REQUEST_FACEBOOK_ACCESS_TOKEN:
      return {
        ...state,
        isPending: true
      };
    case RECEIVE_SERVER_DATA:
      return {
        ...state,
        isPending: false,
        isAuthenticated: true,
        error: null,
        data: action.payload
      };
    case ERROR_AUTH:
      return {
        ...state,
        isPending: false,
        error: action.error,
        data: null
      };
    case LOGGING_OUT:
      return {
        ...state,
        isPending: true,
        isAuthenticated: false,
        error: null
      }
    default:
      return state;
  }
};

module.exports = {
  authenticated
};
