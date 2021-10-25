import {authConstants} from './constants';

export const authActions = {
  login: payload => ({type: authConstants.CREATE_AUTH_REQUEST, payload}),
  loginSuccess: payload => ({type: authConstants.CREATE_AUTH_SUCCESS, payload}),
  loginFailure: error => ({type: authConstants.CREATE_AUTH_FAILURE, error}),

  signUp: payload => ({type: authConstants.SIGN_UP_REQUEST, payload}),
  signUpSuccess: payload => ({type: authConstants.SIGN_UP_SUCCESS, payload}),
  signUpFailure: error => ({type: authConstants.SIGN_UP_FAILURE, error}),

  resetPasswordRequest: (payload, route) => ({
    type: authConstants.RESET_PASSWORD_REQUEST,
    payload,
    route,
  }),
  resetPasswordSuccess: payload => ({
    type: authConstants.RESET_PASSWORD_SUCCESS,
    payload,
  }),
  resetPasswordFailure: error => ({
    type: authConstants.RESET_PASSWORD_FAILURE,
    error,
  }),

  setToken: token => ({type: authConstants.SET_TOKEN_REQUEST, token}),
  setTokenSuccess: token => ({type: authConstants.SET_TOKEN_SUCCESS, token}),

  removeTokenSuccess: () => ({type: authConstants.REMOVE_TOKEN_SUCCESS}),
};
