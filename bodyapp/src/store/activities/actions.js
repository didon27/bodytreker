import {activitiesConstants} from './constants';

export const activitiesActions = {
  getActivities: (payload, refresh) => ({
    type: activitiesConstants.GET_ACTIVITIES,
    payload,
    refresh,
  }),
  getActivitiesSuccess: (payload, refresh) => ({
    type: activitiesConstants.GET_ACTIVITIES_SUCCESS,
    payload,
    refresh,
  }),

  getActivitiesFailure: error => ({
    type: activitiesConstants.GET_ACTIVITIES_FAILURE,
    error,
  }),

  getSubscriptionsActivities: (payload, refresh) => ({
    type: activitiesConstants.GET_SUBSCRIPTIONS_ACTIVITIES,
    payload,
    refresh,
  }),
  getSubscriptionsActivitiesSuccess: (payload, refresh) => ({
    type: activitiesConstants.GET_SUBSCRIPTIONS_ACTIVITIES_SUCCESS,
    payload,
    refresh,
  }),

  getSubscriptionsActivitiesFailure: error => ({
    type: activitiesConstants.GET_SUBSCRIPTIONS_ACTIVITIES_FAILURE,
    error,
  }),

  getMyActivities: (payload, refresh) => ({
    type: activitiesConstants.GET_MY_ACTIVITIES,
    payload,
    refresh,
  }),
  getMyActivitiesSuccess: (payload, refresh) => ({
    type: activitiesConstants.GET_MY_ACTIVITIES_SUCCESS,
    payload,
    refresh,
  }),

  getMyActivitiesFailure: error => ({
    type: activitiesConstants.GET_MY_ACTIVITIES_FAILURE,
    error,
  }),

  getActivitiesCategories: payload => ({
    type: activitiesConstants.GET_ACTIVITIES_CATEGORIES,
    payload,
  }),
  getActivitiesCategoriesSuccess: payload => ({
    type: activitiesConstants.GET_ACTIVITIES_CATEGORIES_SUCCESS,
    payload,
  }),
  getActivitiesCategoriesFailure: error => ({
    type: activitiesConstants.GET_ACTIVITIES_CATEGORIES_FAILURE,
    error,
  }),

  subscribeActivitiy: (payload, item, callback) => ({
    type: activitiesConstants.SUBSCRIBE_ACTIVITY,
    payload,
    item,
    callback,
  }),
  subscribeActivitiySuccess: payload => ({
    type: activitiesConstants.SUBSCRIBE_ACTIVITY_SUCCESS,
    payload,
  }),
  subscribeActivitiyFailure: error => ({
    type: activitiesConstants.SUBSCRIBE_ACTIVITY_FAILURE,
    error,
  }),

  unsubscribeActivity: (payload, callback) => ({
    type: activitiesConstants.UNSUBSCRIBE_ACTIVITY,
    payload,
    callback,
  }),
  unsubscribeActivitySuccess: payload => ({
    type: activitiesConstants.UNSUBSCRIBE_ACTIVITY_SUCCESS,
    payload,
  }),
  unsubscribeActivityFailure: error => ({
    type: activitiesConstants.UNSUBSCRIBE_ACTIVITY_FAILURE,
    error,
  }),

  createNewActivities: (payload, route) => ({
    type: activitiesConstants.CREATE_NEW_ACTIVITIES,
    payload,
    route,
  }),
  createNewActivitiesSuccess: payload => ({
    type: activitiesConstants.CREATE_NEW_ACTIVITIES_SUCCESS,
    payload,
  }),
  createNewActivitiesFailure: error => ({
    type: activitiesConstants.CREATE_NEW_ACTIVITIES_FAILURE,
    error,
  }),

  createNewActivitiesError: error => ({
    type: activitiesConstants.CREATE_NEW_ACTIVITIES_ERROR,
    error,
  }),
};
