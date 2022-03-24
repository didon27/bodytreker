import {authConstants} from './constants';

export const authActions = {
  login: payload => ({type: authConstants.CREATE_AUTH_REQUEST, payload}),
  loginSuccess: payload => ({type: authConstants.CREATE_AUTH_SUCCESS, payload}),
  loginFailure: error => ({type: authConstants.CREATE_AUTH_FAILURE, error}),

  signUp: (payload, route) => ({
    type: authConstants.SIGN_UP_REQUEST,
    payload,
    route,
  }),
  signUpSuccess: payload => ({type: authConstants.SIGN_UP_SUCCESS, payload}),
  signUpFailure: error => ({type: authConstants.SIGN_UP_FAILURE, error}),

  refreshToken: payload => ({
    type: authConstants.REFRESH_TOKEN_REQUEST,
    payload,
  }),
  refreshTokenSuccess: payload => ({
    type: authConstants.REFRESH_TOKEN_SUCCESS,
    payload,
  }),
  refreshTokenFailure: error => ({
    type: authConstants.REFRESH_TOKEN_SUCCESS,
    error,
  }),

  forgotPasswordRequest: (payload, route) => ({
    type: authConstants.FORGOT_PASSWORD_REQUEST,
    payload,
    route,
  }),
  forgotPasswordSuccess: payload => ({
    type: authConstants.FORGOT_PASSWORD_SUCCESS,
    payload,
  }),
  forgotPasswordFailure: error => ({
    type: authConstants.FORGOT_PASSWORD_FAILURE,
    error,
  }),

  verificationForgotPasswordRequest: (payload, route) => ({
    type: authConstants.VERIFICATION_FORGOT_PASSWORD_REQUEST,
    payload,
    route,
  }),
  verificationForgotPasswordSuccess: payload => ({
    type: authConstants.VERIFICATION_FORGOT_PASSWORD_SUCCESS,
    payload,
  }),
  verificationForgotPasswordFailure: error => ({
    type: authConstants.VERIFICATION_FORGOT_PASSWORD_FAILURE,
    error,
  }),

  verificationEmailRequest: (payload, route) => ({
    type: authConstants.VERIFICATION_EMAIL_REQUEST,
    payload,
    route,
  }),
  verificationEmailSuccess: payload => ({
    type: authConstants.VERIFICATION_EMAIL_SUCCESS,
    payload,
  }),
  verificationEmailFailure: error => ({
    type: authConstants.VERIFICATION_EMAIL_FAILURE,
    error,
  }),

  continueRegisterRequest: (payload, route) => ({
    type: authConstants.CONTINUE_REGISTER_REQUEST,
    payload,
    route,
  }),
  continueRegisterSuccess: payload => ({
    type: authConstants.CONTINUE_REGISTER_SUCCESS,
    payload,
  }),
  continueRegisterFailure: error => ({
    type: authConstants.CONTINUE_REGISTER_FAILURE,
    error,
  }),

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

  resendCode: payload => ({
    type: authConstants.RESEND_CODE_REQUEST,
    payload,
  }),
  resendCodeSuccess: payload => ({
    type: authConstants.RESEND_CODE_SUCCESS,
    payload,
  }),
  resendCodeFailure: error => ({
    type: authConstants.RESEND_CODE_FAILURE,
    error,
  }),

  setToken: token => ({type: authConstants.SET_TOKEN_REQUEST, token}),
  setTokenSuccess: token => ({type: authConstants.SET_TOKEN_SUCCESS, token}),

  setErrorLogin: payload => ({type: authConstants.SET_ERROR_LOGIN, payload}),

  setErrorRegister: payload => ({
    type: authConstants.SET_ERROR_REGISTER,
    payload,
  }),

  setErrorRegisterCode: payload => ({
    type: authConstants.SET_ERROR_REGISTER_CODE_VERIFY,
    payload,
  }),

  setErrorContinueRegister: payload => ({
    type: authConstants.SET_ERROR_CONTINUE_REGISTER,
    payload,
  }),

  setErrorForgotPassword: payload => ({
    type: authConstants.SET_ERROR_FORGOT_PASSWORD,
    payload,
  }),
  setErrorPasswordReset: payload => ({
    type: authConstants.SET_ERROR_PASSWORD_RESET,
    payload,
  }),
  setErrorVerificationForgotPassword: payload => ({
    type: authConstants.SET_ERROR_VERIFICATION_FORGOT_PASSWORD,
    payload,
  }),

  removeTokenSuccess: () => ({type: authConstants.REMOVE_TOKEN_SUCCESS}),
};
