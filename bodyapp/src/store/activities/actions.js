import {activitiesConstants} from './constants';

export const activitiesActions = {
  getActivities: payload => ({
    type: activitiesConstants.GET_ACTIVITIES,
    payload,
  }),
  getActivitiesSuccess: payload => ({
    type: activitiesConstants.GET_ACTIVITIES_SUCCESS,
    payload,
  }),
  getMyActivitiesSuccess: payload => ({
    type: activitiesConstants.GET_MY_ACTIVITIES_SUCCESS,
    payload,
  }),
  getActivitiesFailure: error => ({
    type: activitiesConstants.GET_ACTIVITIES_FAILURE,
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
