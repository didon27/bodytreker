import {takeLatest, call, put} from 'redux-saga/effects';

import {activitiesConstants, activitiesActions} from './';
import {userActions} from '../user/';
import {storage} from 'services/storage';
import {api} from 'services/api';
import {navigate} from '../../navigation';

function* getActivities(data) {
  const {payload, refresh} = data;

  try {
    const response = yield call(api.activities.getActivities, payload);
    yield put(activitiesActions.getActivitiesSuccess(response.data, refresh));
  } catch (e) {
    yield put(activitiesActions.getActivitiesFailure(e.response.data.error));
  }
}

function* getSubscriptionsActivities(data) {
  const {payload, refresh} = data;

  try {
    const response = yield call(api.activities.getActivities, payload);
    yield put(
      activitiesActions.getSubscriptionsActivitiesSuccess(
        response.data,
        refresh,
      ),
    );
  } catch (e) {
    yield put(
      activitiesActions.getSubscriptionsActivitiesFailure(
        e.response.data.error,
      ),
    );
  }
}

function* getMyActivities(data) {
  const {payload, refresh} = data;

  console.log(payload);
  try {
    const response = yield call(api.activities.getMyActivities, {
      ...payload,
      userActivities: true,
    });
    yield put(activitiesActions.getMyActivitiesSuccess(response.data, refresh));
  } catch (e) {
    yield put(activitiesActions.getMyActivitiesFailure(e.response.data.error));
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

function* subscribeActivity(data) {
  const {payload, item, callback} = data;

  try {
    const response = yield call(api.activities.subscribeActivity, payload);

    yield put(activitiesActions.subscribeActivitiySuccess(item));
    if (callback) {
      callback();
    }
  } catch (e) {
    console.log('ERRROORRR', e.response.data);
    yield put(
      activitiesActions.subscribeActivitiyFailure(e.response.data.error),
    );
  }
}

function* unsubscribeActivity(data) {
  const {payload, callback} = data;

  console.log('UNSUBSCRIBE', payload);
  try {
    const response = yield call(api.activities.unsubscribeActivity, payload);
    yield put(activitiesActions.unsubscribeActivitySuccess(payload));
    if (callback) {
      callback();
    }
  } catch (e) {
    console.log('ERRROORRR', e.response.data);
    yield put(
      activitiesActions.unsubscribeActivityFailure(e.response.data.error),
    );
  }
}

export function* activitiesSaga() {
  yield takeLatest(
    activitiesConstants.GET_ACTIVITIES_CATEGORIES,
    getActivitiesCategories,
  );
  yield takeLatest(
    activitiesConstants.GET_SUBSCRIPTIONS_ACTIVITIES,
    getSubscriptionsActivities,
  );
  yield takeLatest(activitiesConstants.GET_ACTIVITIES, getActivities);
  yield takeLatest(activitiesConstants.GET_MY_ACTIVITIES, getMyActivities);
  yield takeLatest(activitiesConstants.SUBSCRIBE_ACTIVITY, subscribeActivity);
  yield takeLatest(
    activitiesConstants.UNSUBSCRIBE_ACTIVITY,
    unsubscribeActivity,
  );
  yield takeLatest(
    activitiesConstants.CREATE_NEW_ACTIVITIES,
    createNewActivities,
  );
}
