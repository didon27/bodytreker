import { userConstants } from './constants';

export const userActions = {
  fetch: payload => ({ type: userConstants.FETCH_USER_REQUEST, payload }),
  fetchSuccess: payload => ({ type: userConstants.FETCH_USER_SUCCESS, payload }),
  fetchFailure: error => ({ type: userConstants.FETCH_USER_FAILURE, error }),

  create: (payload, route) => ({
    type: userConstants.CREATE_USER_REQUEST,
    payload,
    route,
  }),
  createSuccess: () => ({ type: userConstants.CREATE_USER_SUCCESS }),
  createFailure: error => ({ type: userConstants.CREATE_USER_FAILURE, error }),

  updateUser: (payload, route) => ({
    type: userConstants.UPDATE_USER_REQUEST,
    payload,
    route,
  }),
  updateUserSuccess: payload => ({
    type: userConstants.UPDATE_USER_SUCCESS,
    payload,
  }),
  updateUserFailure: error => ({
    type: userConstants.UPDATE_USER_FAILURE,
    error,
  }),

  updateUserLocation: payload => ({
    type: userConstants.UPDATE_USER_LOCATION,
    payload,
  }),


  subscribeUser: (payload, refreshUser) => ({
    type: userConstants.SUBSCRIBE_USER_REQUEST,
    payload,
    refreshUser,
  }),
  subscribeUserSuccess: payload => ({
    type: userConstants.SUBSCRIBE_USER_SUCCESS,
    payload,
  }),
  subscribeUserFailure: error => ({
    type: userConstants.SUBSCRIBE_USER_FAILURE,
    error,
  }),

  unsubscribeUser: (payload, refreshUser) => ({
    type: userConstants.UNSUBSCRIBE_USER_REQUEST,
    payload,
    refreshUser,
  }),
  unsubscribeUserSuccess: payload => ({
    type: userConstants.UNSUBSCRIBE_USER_SUCCESS,
    payload,
  }),
  unsubscribeUserFailure: error => ({
    type: userConstants.UNSUBSCRIBE_USER_FAILURE,
    error,
  }),

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
