import {all} from 'redux-saga/effects';

import {authSaga} from './auth';
import {userSaga} from './user';
import {activitiesSaga} from './activities';

export default function* () {
  yield all([authSaga(), userSaga(), activitiesSaga()]);
}
