import Expo from 'expo';

import { LOGIN, LOGOUT } from './actionTypes';
import { FACEBOOK_APP_ID } from '../config';
import { FB_LOGIN_API } from './api/apiTypes';
import { query } from './api/query';
import { errorAlert, messageAlert } from './alert';

const login = payload => ({
  type: LOGIN,
  payload
});

const logout = () => ({
  type: LOGOUT
});

const loginFacebook = () => async(dispatch) => {
  try {
    let response = await Expo.Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
      permissions: ['public_profile', 'email', 'user_likes'],
      // behavior: 'native'
    });
    // console.log(response);
    if (response.type === 'success') {
      let data = await query(null, FB_LOGIN_API, 'POST', response.token);
      return dispatch(login(data));
    }
    else return dispatch(errorAlert(response.type || 'Errors of server data occured!'));
  } catch(err) {
    return dispatch(errorAlert(err));
  }
};

module.exports = {
  loginFacebook,
  logout
};
