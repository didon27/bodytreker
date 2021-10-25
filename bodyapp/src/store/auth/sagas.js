import {takeLatest, call, put} from 'redux-saga/effects';

import {authConstants, authActions} from './';
import {userActions} from '../user/';
import {storage} from '_services/storage';
import {api} from '_services/api';
import {navigate} from '../../navigation';

function* create(data) {
  try {
    const response = yield call(api.auth.signIn, data.payload);
    const userToken = `Bearer ${response.data.accessToken}`;
    yield call(storage.save, 'UserToken', userToken);

    yield put(authActions.loginSuccess());
    yield put(userActions.fetch(userToken));
  } catch (e) {
    if (e.status === 404) {
      yield put(
        authActions.loginFailure(
          'An account with this combination of email and password is not found',
        ),
      );
    } else {
      yield put(authActions.loginFailure(e.response.data.message));
    }
  }
}

function* reset(data) {
  const {route, payload} = data;

  try {
    const response = yield call(api.auth.reset, payload);
    yield put(authActions.resetPasswordSuccess());
    if (route) {
      yield call(navigate, route.route, route.params);
    }
  } catch (e) {
    console.log('error', e);
    yield put(authActions.resetPasswordFailure(e.response.data.error));
  }
}

function* signUp(data) {
  const {route, payload} = data;
  try {
    const response = yield call(api.auth.signUp, payload);
    yield put(authActions.signUpSuccess());
    if (route) {
      yield call(navigate, route.route, route.params);
    }
  } catch (e) {
    console.log('error', e);
    yield put(authActions.signUpFailure(e.response.data.error));
  }
}

function* set(payload) {
  if (payload.token) {
    yield put(userActions.fetch(payload.token));
  } else {
    yield put(authActions.setTokenSuccess(null));
  }
}

export function* authSaga() {
  yield takeLatest(authConstants.RESET_PASSWORD_REQUEST, reset);
  yield takeLatest(authConstants.CREATE_AUTH_REQUEST, create);
  yield takeLatest(authConstants.SET_TOKEN_REQUEST, set);
  yield takeLatest(authConstants.SIGN_UP_REQUEST, signUp);
}
