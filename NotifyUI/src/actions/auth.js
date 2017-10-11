import Expo from 'expo';
import { AsyncStorage } from 'react-native';

import {
  REQUEST_FACEBOOK_ACCESS_TOKEN,
  RECEIVE_SERVER_DATA,
  ERROR_AUTH,
  LOGGING_OUT,
  LOAD_AUTH_STATE,
  SET_AUTH_STATE,
  DELETE_ALL_STATES
} from './actionTypes';
import { FACEBOOK_APP_ID, JWT_TOKEN } from '../config';

const requestLoginFacebook = () => ({
  type: REQUEST_FACEBOOK_ACCESS_TOKEN
});

const receiveServerData = payload => ({
  type: RECEIVE_SERVER_DATA,
  payload
});

const errorAuth = err => ({
  type: ERROR_AUTH,
  error: err
});

const loggingOut = () => ({
  type: LOGGING_OUT
});

const deleteAllStates = () => ({
  type: DELETE_ALL_STATES
});

const loadAuthState = () => ({
  type: LOAD_AUTH_STATE
})

const setAuthState = (auth, data) => ({
  type: SET_AUTH_STATE,
  payload: {
    auth, data
  }
});

const onSignIn = token => AsyncStorage.setItem(JWT_TOKEN, token);

const onSignOut = () => AsyncStorage.removeItem(JWT_TOKEN);

const checkAuth = () => async(dispatch) => {
  dispatch(loadAuthState());
  try {
    let token = await AsyncStorage.getItem(JWT_TOKEN);
    let response = await fetch('http://localhost:8080/info', {
      headers: new Headers({'Authorization': token})
    });
    let data = await response.json();
    return dispatch(setAuthState(true, data.payload));
  } catch(err) {
    // console.log(err);
    return dispatch(setAuthState(false, null));
  }
};

const loginFacebook = () => async(dispatch) => {
  dispatch(requestLoginFacebook());
  try {
    let response = await Expo.Facebook.logInWithReadPermissionsAsync(FACEBOOK_APP_ID, {
      permissions: ['public_profile', 'email', 'user_likes'],
      // behavior: 'native'
    });
    // console.log(response);
    if (response.type === 'success') {
      let token = response.token;

      response = await fetch('http://localhost:8080/auth/fblogin', {
        method: 'POST',
        body: JSON.stringify({ token })
      });
      let data = await response.json();
      await onSignIn(data.token);
      return dispatch(receiveServerData(data));
    }
    else return dispatch(errorAuth(response.type || 'Errors occured!'));
  } catch(err) {
    return dispatch(errorAuth(err));
  }
};

const logout = () => async(dispatch) => {
  try {
    dispatch(loggingOut());
    await onSignOut();
    return dispatch(deleteAllStates());
  } catch(err) {
    return dispatch(errorAuth(err));
  }
};

module.exports = {
  loginFacebook,
  logout,
  checkAuth
};
