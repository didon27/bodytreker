import {all} from 'redux-saga/effects';

import {authSaga} from './auth';
import {userSaga} from './user';

export default function *() {
  yield all([authSaga(), userSaga()]);
}
