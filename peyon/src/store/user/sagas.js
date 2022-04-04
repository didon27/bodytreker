import { takeLatest, call, put } from 'redux-saga/effects';

import { api, mamaAxios } from 'services/api';
import { userConstants, userActions } from './';
import { authActions } from '../auth';
import { navigate } from '../../navigation';
import { storage } from 'services/storage';
import { keys } from 'enums';

function* fetch(data) {
  try {
    mamaAxios.defaults.headers.common.Authorization = data.payload;

    const response = yield call(api.user.fetch);
    yield put(userActions.fetchSuccess(response.data));
    yield put(authActions.setTokenSuccess(data.payload));
  } catch (e) {
    if (!e?.response?.data) {
      storage.delete(keys.JWT_TOKEN);
      yield put(authActions.removeTokenSuccess());
    }
    yield put(userActions.fetchFailure(e.response?.data.error));
  }
}

function* create(data) {
  const { route } = data;
  try {
    const response = yield call(api.user.create, data.payload);
    const userToken = `Bearer ${response.data.access_token}`;

    yield call(storage.save, 'UserToken', userToken);

    mamaAxios.defaults.headers.common.Authorization = userToken;
    yield put(authActions.setTokenSuccess(userToken));
    yield put(userActions.createSuccess());
    if (route) {
      yield call(navigate, route.route, route.params);
    }
  } catch (e) {
    yield put(userActions.createFailure(e.response.data.error));
  }
}

function* updateUser(data) {
  const { route } = data;
  try {
    const response = yield call(api.user.updateUser, data.payload);
    yield put(userActions.updateUserSuccess(response.data));
    if (route) {
      yield call(navigate, route.route, route.params);
    }
  } catch (e) {
    yield put(userActions.updateUserFailure(e.response.data.error));
  }
}

function* subscribeUser(data) {
  const { payload, refreshUser } = data;
  try {
    const response = yield call(api.user.subscribeUser, payload);
    yield put(userActions.subscribeUserSuccess(response.data));
    if (refreshUser) {
      refreshUser();
    }
  } catch (e) {
    yield put(userActions.subscribeUserFailure(e.response.data.error));
  }
}

function* unsubscribeUser(data) {
  const { payload, refreshUser } = data;
  try {
    const response = yield call(api.user.unsubscribeUser, payload);
    yield put(userActions.unsubscribeUserSuccess(response.data));
    if (refreshUser) {
      refreshUser();
    }
  } catch (e) {
    yield put(userActions.unsubscribeUserFailure(e.response.data.error));
  }
}

function* checkVerificationCode(data) {
  try {
    const response = yield call(api.user.checkVerificationCode, data.payload);
    yield put(
      userActions.checkVerificationCodeSuccess(response.data.access_token),
    );
  } catch (e) {
    yield put(userActions.checkVerificationCodeFailure(e.response.data.error));
  }
}

export function* userSaga() {
  yield takeLatest(userConstants.FETCH_USER_REQUEST, fetch);
  yield takeLatest(userConstants.CREATE_USER_REQUEST, create);
  yield takeLatest(userConstants.SUBSCRIBE_USER_REQUEST, subscribeUser);
  yield takeLatest(userConstants.UNSUBSCRIBE_USER_REQUEST, unsubscribeUser);
  yield takeLatest(userConstants.UPDATE_USER_REQUEST, updateUser);
  yield takeLatest(
    userConstants.CHECK_VERIFICATION_CODE_REQUEST,
    checkVerificationCode,
  );
}
