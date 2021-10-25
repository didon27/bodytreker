import {authConstants} from './constants';

const initialState = {
  loading: false,
  tokenLoading: true,
  error: null,
  token: null,
  resetPasswordLoading: false,
  resetPasswordError: null,
};

export const authReducer = (state = initialState, action) => {
  const {error, token} = action;

  switch (action.type) {
    case authConstants.CREATE_AUTH_REQUEST:
      return {...state, loading: true, error: null};
    case authConstants.CREATE_AUTH_SUCCESS:
      return {...state, loading: false};
    case authConstants.CREATE_AUTH_FAILURE:
      return {...state, loading: false, error: error};

    case authConstants.SIGN_UP_REQUEST:
      return {...state, loading: true, error: null};
    case authConstants.SIGN_UP_SUCCESS:
      return {...state, loading: false};
    case authConstants.SIGN_UP_FAILURE:
      return {...state, loading: false, error: error};

    case authConstants.RESET_PASSWORD_REQUEST:
      return {...state, resetPasswordLoading: true, resetPasswordError: null};
    case authConstants.RESET_PASSWORD_SUCCESS:
      return {...state, resetPasswordLoading: false};
    case authConstants.RESET_PASSWORD_FAILURE:
      return {...state, resetPasswordLoading: false, resetPasswordError: error};

    case authConstants.SET_TOKEN_REQUEST:
      return {...state, tokenLoading: true};
    case authConstants.SET_TOKEN_SUCCESS:
      return {...state, token, tokenLoading: false};

    case authConstants.REMOVE_TOKEN_SUCCESS:
      return {...state, token: null, tokenLoading: false};

    default:
      return state;
  }
};
