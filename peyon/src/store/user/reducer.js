import { userConstants } from './constants';

import { authConstants } from '../auth';

const initialState = {
  createUserLoading: false,
  createUserError: null,
  codeLoading: false,
  updateUserLoading: false,
  updateUserError: false,
  subscribeUserLoading: false,
  isCodeValid: false,
  codeError: null,
  user: {},
  chatList: [],
  chatListLoading: false,
  userLocation: { lat: null, lng: null }
};

export const userReducer = (state = initialState, action) => {
  const { error, payload } = action;

  switch (action.type) {
    case userConstants.FETCH_USER_REQUEST:
      return { ...state, loading: true, error: null };
    case userConstants.FETCH_USER_SUCCESS:
      return { ...state, loading: false, user: payload };
    case userConstants.FETCH_USER_FAILURE:
      return { ...state, loading: false, error };

    case userConstants.GET_CHAT_LIST_REQUEST:
      return { ...state, chatListLoading: true, error: null };
    case userConstants.GET_CHAT_LIST_SUCCESS:
      return { ...state, chatListLoading: false, chatList: payload };
    case userConstants.GET_CHAT_LIST_FAILURE:
      return { ...state, chatListLoading: false, error };

    case userConstants.CREATE_USER_REQUEST:
      return { ...state, createUserLoading: true, createUserError: null };
    case userConstants.CREATE_USER_SUCCESS:
      return { ...state, createUserLoading: false };
    case userConstants.CREATE_USER_FAILURE:
      return { ...state, createUserLoading: false, createUserError: error };

    case userConstants.UPDATE_USER_LOCATION:
      return { ...state, userLocation: payload };

    case userConstants.UPDATE_USER_REQUEST:
      return { ...state, updateUserLoading: true, updateUserError: null };
    case userConstants.UPDATE_USER_SUCCESS:
      return {
        ...state,
        updateUserLoading: false,
        user: { ...state.user, ...payload },
      };
    case userConstants.UPDATE_USER_FAILURE:
      return { ...state, updateUserLoading: false, updateUserError: error };

    case userConstants.SUBSCRIBE_USER_REQUEST:
      return { ...state, subscribeUserLoading: true, error: null };
    case userConstants.SUBSCRIBE_USER_SUCCESS:
      return {
        ...state,
        subscribeUserLoading: false,
        user: { ...state.user, followings: state.user.followings + 1 },
      };
    case userConstants.SUBSCRIBE_USER_FAILURE:
      return { ...state, subscribeUserLoading: false, error: error };

    case userConstants.UNSUBSCRIBE_USER_REQUEST:
      return { ...state, subscribeUserLoading: true, error: null };
    case userConstants.UNSUBSCRIBE_USER_SUCCESS:
      return {
        ...state,
        subscribeUserLoading: false,
        user: { ...state.user, followings: state.user.followings - 1 },
      };
    case userConstants.UNSUBSCRIBE_USER_FAILURE:
      return { ...state, subscribeUserLoading: false, error: error };

    case userConstants.UPDATE_USER:
      return { ...state, updateUserLoading: false, user: payload };

    case userConstants.CHECK_VERIFICATION_CODE_REQUEST:
      return {
        ...state,
        codeLoading: true,
        codeError: null,
        isCodeValid: false,
      };
    case userConstants.CHECK_VERIFICATION_CODE_SUCCESS:
      return {
        ...state,
        codeLoading: false,
        isCodeValid: true,
        tempToken: payload,
      };
    case userConstants.CHECK_VERIFICATION_CODE_FAILURE:
      return {
        ...state,
        codeLoading: false,
        codeError: error,
        isCodeValid: false,
      };

    case authConstants.CREATE_AUTH_SUCCESS:
      return { ...state, loading: false };

    case authConstants.REMOVE_TOKEN_SUCCESS:
      return initialState;

    default:
      return state;
  }
};
