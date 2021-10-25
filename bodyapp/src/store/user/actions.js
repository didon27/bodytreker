import {userConstants} from './constants';

export const userActions = {
  fetch: payload => ({type: userConstants.FETCH_USER_REQUEST, payload}),
  fetchSuccess: payload => ({type: userConstants.FETCH_USER_SUCCESS, payload}),
  fetchFailure: error => ({type: userConstants.FETCH_USER_FAILURE, error}),

  create: (payload, route) => ({
    type: userConstants.CREATE_USER_REQUEST,
    payload,
    route,
  }),
  createSuccess: () => ({type: userConstants.CREATE_USER_SUCCESS}),
  createFailure: error => ({type: userConstants.CREATE_USER_FAILURE, error}),

  update: (payload, route) => ({
    type: userConstants.UPDATE_USER_REQUEST,
    payload,
    route,
  }),
  updateSuccess: payload => ({
    type: userConstants.UPDATE_USER_SUCCESS,
    payload,
  }),
  updateFailure: error => ({type: userConstants.UPDATE_USER_FAILURE, error}),

  updateUser: payload => ({type: userConstants.UPDATE_USER, payload}),

  checkVerificationCode: payload => ({
    type: userConstants.CHECK_VERIFICATION_CODE_REQUEST,
    payload,
  }),
  checkVerificationCodeSuccess: payload => ({
    type: userConstants.CHECK_VERIFICATION_CODE_SUCCESS,
    payload,
  }),
  checkVerificationCodeFailure: error => ({
    type: userConstants.CHECK_VERIFICATION_CODE_FAILURE,
    error,
  }),
};
