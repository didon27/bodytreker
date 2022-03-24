import {authConstants} from './constants';

const initialState = {
  loading: false,
  tokenLoading: true,
  error: null,
  errorLogin: null,
  errorRegister: null,
  errorRegisterCode: null,
  errorContinueRegister: null,
  token: null,
  forgotPasswordError: null,
  verificationForgotPasswordError: null,
  reset_token: null,
  resetPasswordError: null,
};

export const authReducer = (state = initialState, action) => {
  const {error, token} = action;

  switch (action.type) {
    case authConstants.CREATE_AUTH_REQUEST:
      return {...state, loading: true, errorLogin: null};
    case authConstants.CREATE_AUTH_SUCCESS:
      return {...state, loading: false};
    case authConstants.CREATE_AUTH_FAILURE:
      return {...state, loading: false, errorLogin: error};

    case authConstants.SIGN_UP_REQUEST:
      return {...state, loading: true, errorRegister: null};
    case authConstants.SIGN_UP_SUCCESS:
      return {...state, loading: false};
    case authConstants.SIGN_UP_FAILURE:
      return {...state, loading: false, errorRegister: error};

    case authConstants.REFRESH_TOKEN_REQUEST:
      return {...state, loading: true, error: null};
    case authConstants.REFRESH_TOKEN_SUCCESS:
      return {...state, loading: false};
    case authConstants.REFRESH_TOKEN_FAILURE:
      return {...state, loading: false, error: error};

    case authConstants.RESET_PASSWORD_REQUEST:
      return {...state, loading: true, resetPasswordError: null};
    case authConstants.RESET_PASSWORD_SUCCESS:
      return {...state, loading: false};
    case authConstants.RESET_PASSWORD_FAILURE:
      return {...state, loading: false, resetPasswordError: error};

    case authConstants.VERIFICATION_EMAIL_REQUEST:
      return {...state, loading: true, errorRegisterCode: null};
    case authConstants.VERIFICATION_EMAIL_SUCCESS:
      return {...state, loading: false};
    case authConstants.VERIFICATION_EMAIL_FAILURE:
      return {...state, loading: false, errorRegisterCode: error};

    case authConstants.CONTINUE_REGISTER_REQUEST:
      return {...state, loading: true, errorContinueRegister: null};
    case authConstants.CONTINUE_REGISTER_SUCCESS:
      return {...state, loading: false};
    case authConstants.CONTINUE_REGISTER_FAILURE:
      return {...state, loading: false, errorContinueRegister: error};

    case authConstants.FORGOT_PASSWORD_REQUEST:
      return {...state, loading: true, forgotPasswordError: null};
    case authConstants.FORGOT_PASSWORD_SUCCESS:
      return {...state, loading: false};
    case authConstants.FORGOT_PASSWORD_FAILURE:
      return {...state, loading: false, forgotPasswordError: error};

    case authConstants.VERIFICATION_FORGOT_PASSWORD_REQUEST:
      return {
        ...state,
        loading: true,
        verificationForgotPasswordError: null,
        reset_token: null,
      };
    case authConstants.VERIFICATION_FORGOT_PASSWORD_SUCCESS:
      return {...state, loading: false, reset_token: action.payload};
    case authConstants.VERIFICATION_FORGOT_PASSWORD_FAILURE:
      return {...state, loading: false, verificationForgotPasswordError: error};

    case authConstants.SET_TOKEN_REQUEST:
      return {...state, tokenLoading: true};
    case authConstants.SET_TOKEN_SUCCESS:
      return {...state, token, tokenLoading: false};

    case authConstants.SET_ERROR_LOGIN:
      return {...state, errorLogin: action.payload};

    case authConstants.SET_ERROR_REGISTER:
      return {...state, errorRegister: action.payload};

    case authConstants.SET_ERROR_FORGOT_PASSWORD:
      return {...state, forgotPasswordError: action.payload};
      
    case authConstants.SET_ERROR_PASSWORD_RESET:
      return {...state, resetPasswordError: action.payload};

    case authConstants.SET_ERROR_VERIFICATION_FORGOT_PASSWORD:
      return {...state, verificationForgotPasswordError: action.payload};

    case authConstants.SET_ERROR_CONTINUE_REGISTER:
      return {...state, errorContinueRegister: action.payload};

    case authConstants.SET_ERROR_REGISTER_CODE_VERIFY:
      return {...state, errorRegisterCode: action.payload};

    case authConstants.REMOVE_TOKEN_SUCCESS:
      return {...state, token: null, tokenLoading: false};

    default:
      return state;
  }
};
