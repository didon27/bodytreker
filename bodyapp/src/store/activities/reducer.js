import {activitiesConstants} from './constants';

const initialState = {
  activities: {activities: []},
  myActivities: {},
  subscriptionActivities: [],
  activities_categories: [],
  activitiesLoading: false,
  subscriptionActivitiesLoading: false,
  createNewActivitiesError: null,
  subscribeActivityLoading: false,
};

export const activitiesReducer = (state = initialState, action) => {
  const {error, payload, refresh} = action;

  switch (action.type) {
    case activitiesConstants.GET_ACTIVITIES:
      return {...state, activitiesLoading: true, error: null};
    case activitiesConstants.GET_ACTIVITIES_SUCCESS:
      return {
        ...state,
        activitiesLoading: false,
        activities: !refresh
          ? {
              ...state.activities,
              activities: [
                ...state.activities.activities,
                ...payload.activities,
              ],
            }
          : payload,
      };
    case activitiesConstants.GET_ACTIVITIES_FAILURE:
      return {...state, activitiesLoading: false, error: error};

    case activitiesConstants.GET_MY_ACTIVITIES_SUCCESS:
      return {...state, loading: false, myActivities: payload};

    case activitiesConstants.GET_SUBSCRIPTIONS_ACTIVITIES:
      return {...state, subscriptionActivitiesLoading: false, error: null};
    case activitiesConstants.GET_SUBSCRIPTIONS_ACTIVITIES_SUCCESS:
      return {
        ...state,
        subscriptionActivitiesLoading: false,
        subscriptionActivities: !refresh
          ? {
              ...state.subscriptionActivities,
              activities: [
                ...state.subscriptionActivities.activities,
                ...payload.activities,
              ],
            }
          : payload,
      };
    case activitiesConstants.GET_SUBSCRIPTIONS_ACTIVITIES_FAILURE:
      return {...state, subscriptionActivitiesLoading: false, error: error};

    case activitiesConstants.CREATE_NEW_ACTIVITIES:
      return {...state, loading: true, error: null};
    case activitiesConstants.CREATE_NEW_ACTIVITIES_SUCCESS:
      return {...state, loading: false};
    case activitiesConstants.CREATE_NEW_ACTIVITIES_FAILURE:
      return {...state, loading: false, error: error};

    case activitiesConstants.SUBSCRIBE_ACTIVITY:
      return {...state, subscribeActivityLoading: true, error: null};
    case activitiesConstants.SUBSCRIBE_ACTIVITY_SUCCESS:
      return {
        ...state,
        subscribeActivityLoading: false,
        subscriptionActivities: {
          ...state.subscriptionActivities,
          totalItems: state.subscriptionActivities.totalItems + 1,
          activities: [
            {...payload, subscribe: true},
            ...state.subscriptionActivities.activities,
          ],
        },
        activities: {
          ...state.subscriptionActivities,
          totalItems: state.activities.totalItems - 1,
          activities: state.activities.activities.filter(
            el => el.id !== payload.id,
          ),
        },
      };
    case activitiesConstants.SUBSCRIBE_ACTIVITY_FAILURE:
      return {...state, subscribeActivityLoading: false, error: error};

    case activitiesConstants.UNSUBSCRIBE_ACTIVITY:
      return {...state, subscribeActivityLoading: true, error: null};
    case activitiesConstants.UNSUBSCRIBE_ACTIVITY_SUCCESS:
      return {
        ...state,
        subscribeActivityLoading: false,
        subscriptionActivities: {
          ...state.subscriptionActivities,
          totalItems: state.subscriptionActivities.totalItems - 1,
          activities: state.subscriptionActivities.activities.filter(
            el => el.id !== payload.activity_id,
          ),
        },
      };
    case activitiesConstants.UNSUBSCRIBE_ACTIVITY_FAILURE:
      return {...state, subscribeActivityLoading: false, error: error};

    case activitiesConstants.GET_ACTIVITIES_CATEGORIES:
      return {...state, loading: true, error: null};
    case activitiesConstants.GET_ACTIVITIES_CATEGORIES_SUCCESS:
      return {...state, loading: false, activities_categories: payload};
    case activitiesConstants.GET_ACTIVITIES_CATEGORIES_FAILURE:
      return {...state, loading: false, error: error};

    case activitiesConstants.CREATE_NEW_ACTIVITIES_ERROR:
      return {...state, loading: false, createNewActivitiesError: error};

    default:
      return state;
  }
};
