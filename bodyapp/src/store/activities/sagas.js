import {takeLatest, call, put} from 'redux-saga/effects';

import {activitiesConstants, activitiesActions} from './';
import {userActions} from '../user/';
import {storage} from 'services/storage';
import {api} from 'services/api';
import {navigate} from '../../navigation';

function* getActivities(data) {
  const {payload} = data;

  try {
    const response = yield call(api.activities.getActivities, payload);
    if (payload.actual) {
      yield put(activitiesActions.getActivitiesSuccess(response.data));
    } else {
      yield put(activitiesActions.getMyActivitiesSuccess(response.data));
    }
  } catch (e) {
    yield put(activitiesActions.getActivitiesFailure(e.response.data.error));
  }
}

function* getActivitiesCategories(data) {
  try {
    const response = yield call(
      api.activities.getActivitiesCategories,
      data.payload,
    );
    yield put(activitiesActions.getActivitiesCategoriesSuccess(response.data));
  } catch (e) {
    yield put(
      activitiesActions.getActivitiesCategoriesFailure(e.response.data.error),
    );
  }
}

function* createNewActivities(data) {
  const {route, payload} = data;

  try {
    const response = yield call(api.activities.createNewActivities, payload);

    console.log(response.data);
    yield put(activitiesActions.createNewActivitiesSuccess(response.data));
    if (route) {
      yield call(navigate, route.route, route.params);
    }
  } catch (e) {
    yield put(
      activitiesActions.createNewActivitiesFailure(e.response.data.error),
    );
  }
}

export function* activitiesSaga() {
  yield takeLatest(
    activitiesConstants.GET_ACTIVITIES_CATEGORIES,
    getActivitiesCategories,
  );
  yield takeLatest(activitiesConstants.GET_ACTIVITIES, getActivities);
  yield takeLatest(
    activitiesConstants.CREATE_NEW_ACTIVITIES,
    createNewActivities,
  );
}
