import { RECEIVE_USER_DATA, ERROR_ALERT } from './actionTypes';
import { INFO_API } from './api/apiTypes';
import { query } from './api/query';
import { errorAlert } from './alert';

const receiveUserData = payload => ({
  type: RECEIVE_USER_DATA,
  payload
});

const loadUser = token => async(dispatch) => {
  try {
    let data = await query(token, INFO_API, 'GET');
    return dispatch(receiveUserData(data));
  } catch(err) {
    // console.log(err);
    return dispatch(errorAlert(err));
  }
};

module.exports = {
  loadUser
};