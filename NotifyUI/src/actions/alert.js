import { ERROR_ALERT, END_ALERT, MESSAGE_ALERT } from './actionTypes';

const errorAlert = err => ({
  type: ERROR_ALERT,
  error: err
});

const messageAlert = message => ({
  type: MESSAGE_ALERT,
  message
});

const endAlert = () => ({
  type: END_ALERT
});

module.exports = {
  errorAlert,
  endAlert,
  messageAlert
};