import { ERROR_ALERT, END_ALERT, MESSAGE_ALERT } from '../actions/actionTypes';

const initialState = {
  error: null,
  message: null
};

const alert = (state = initialState, action) => {
  switch (action.type) {
    case ERROR_ALERT:
      return {
        ...state,
        error: action.error
      };
    case END_ALERT:
      return {
        ...state,
        error: null,
        message: null
      }
    case MESSAGE_ALERT:
      return {
        ...state,
        message: action.message
      }
    default:
      return state;
  }
};

module.exports = {
  alert
};
