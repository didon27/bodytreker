import {takeLatest, call, put} from 'redux-saga/effects';

import {authConstants, authActions} from './';
import {userActions} from '../user/';
import {storage} from 'services/storage';
import {api} from 'services/api';
import {navigate} from '../../navigation';
import RNRestart from 'react-native-restart';

function* create(data) {
  try {
    const response = yield call(api.auth.signIn, data.payload);
    const userToken = `Bearer ${response.data.accessToken}`;
    yield call(storage.save, 'UserToken', userToken);
    yield call(storage.save, 'RefreshToken', response.data.refreshToken);

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
      console.log('fdsgsdfg', e)
      yield put(authActions.loginFailure(e.response.data));
    }
  }
}

function* refreshToken(data) {
  const {payload} = data;

  try {
    const response = yield call(api.auth.refreshToken, payload);
    const userToken = `Bearer ${response.data.accessToken}`;
    yield call(storage.save, 'UserToken', userToken);
    yield call(storage.save, 'RefreshToken', response.data.refreshToken);
    yield put(authActions.setToken(userToken));
    yield put(authActions.refreshTokenSuccess());
  } catch (e) {
    yield put(authActions.refreshTokenFailure(e.response.data.error));
    yield call(storage.delete, 'UserToken');
    yield call(storage.delete, 'RefreshToken');
    RNRestart.Restart();
  }
}

function* forgotPassword(data) {
  const {route, payload} = data;

  try {
    const response = yield call(api.auth.forgotPassword, payload);
    yield put(authActions.forgotPasswordSuccess());
    if (route) {
      yield call(navigate, route.route, route.params);
    }
  } catch (e) {
    yield put(authActions.forgotPasswordFailure(e.response.data.message));
  }
}

function* verificationForgotPassword(data) {
  const {route, payload} = data;

  try {
    const response = yield call(api.auth.verificationForgotPassword, payload);
    yield put(
      authActions.verificationForgotPasswordSuccess(response.data.reset_token),
    );
    if (route) {
      yield call(navigate, route.route, route.params);
    }
  } catch (e) {
    yield put(
      authActions.verificationForgotPasswordFailure(e.response.data.message),
    );
  }
}

function* resetPassword(data) {
  const {route, payload} = data;

  try {
    const response = yield call(api.auth.resetPassword, payload);
    const userToken = `Bearer ${response.data.accessToken}`;
    yield call(storage.save, 'UserToken', userToken);
    yield call(storage.save, 'RefreshToken', response.data.refreshToken);
    yield put(authActions.setToken(userToken));

    yield put(authActions.resetPasswordSuccess());
    if (route) {
      yield call(navigate, route.route, route.params);
    }
  } catch (e) {
    yield put(authActions.resetPasswordFailure(e.response.data));
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
    yield put(authActions.signUpFailure(e.response.data.message));
  }
}

function* verificationEmail(data) {
  const {route, payload} = data;

  try {
    const response = yield call(api.auth.verificationEmail, payload);
    yield put(authActions.verificationEmailSuccess());
    if (route) {
      yield call(navigate, route.route, route.params);
    }
  } catch (e) {
    console.log('error', e.response.data);
    yield put(authActions.verificationEmailFailure(e.response.data.message));
  }
}

function* set(payload) {
  if (payload.token) {
    yield put(userActions.fetch(payload.token));
  } else {
    yield put(authActions.setTokenSuccess(null));
  }
}

function* resendCode(data) {
  const {payload} = data;

  try {
    const response = yield call(api.auth.resendCode, payload);
    yield put(authActions.resendCodeSuccess());
  } catch (e) {
    yield put(authActions.resendCodeFailure(e.response.data.message));
  }
}

function* continueRegister(data) {
  const {payload} = data;

  try {
    const response = yield call(api.auth.continueRegister, payload);
    const userToken = `Bearer ${response.data.accessToken}`;
    yield call(storage.save, 'UserToken', userToken);
    yield call(storage.save, 'RefreshToken', response.data.refreshToken);
    yield put(authActions.setToken(userToken));
    yield put(authActions.continueRegisterSuccess());
  } catch (e) {
    yield put(authActions.continueRegisterFailure(e.response.data));
  }
}

export function* authSaga() {
  yield takeLatest(
    authConstants.VERIFICATION_FORGOT_PASSWORD_REQUEST,
    verificationForgotPassword,
  );
  yield takeLatest(authConstants.FORGOT_PASSWORD_REQUEST, forgotPassword);
  yield takeLatest(authConstants.RESET_PASSWORD_REQUEST, resetPassword);
  yield takeLatest(authConstants.CREATE_AUTH_REQUEST, create);
  yield takeLatest(authConstants.SET_TOKEN_REQUEST, set);
  yield takeLatest(authConstants.SIGN_UP_REQUEST, signUp);
  yield takeLatest(authConstants.RESEND_CODE_REQUEST, resendCode);
  yield takeLatest(authConstants.REFRESH_TOKEN_REQUEST, refreshToken);
  yield takeLatest(authConstants.VERIFICATION_EMAIL_REQUEST, verificationEmail);
  yield takeLatest(authConstants.CONTINUE_REGISTER_REQUEST, continueRegister);
}
