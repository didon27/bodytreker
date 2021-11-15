import {activitiesConstants} from './constants';

const initialState = {
  activities: [],
  activities_categories: [],
};

export const activitiesReducer = (state = initialState, action) => {
  const {error, payload} = action;

  switch (action.type) {
    case activitiesConstants.GET_ACTIVITIES:
      return {...state, loading: true, error: null};
    case activitiesConstants.GET_ACTIVITIES_SUCCESS:
      return {...state, loading: false, activities: payload};
    case activitiesConstants.GET_ACTIVITIES_FAILURE:
      return {...state, loading: false, error: error};

    case activitiesConstants.CREATE_NEW_ACTIVITIES:
      return {...state, loading: true, error: null};
    case activitiesConstants.CREATE_NEW_ACTIVITIES_SUCCESS:
      return {...state, loading: false};
    case activitiesConstants.CREATE_NEW_ACTIVITIES_FAILURE:
      return {...state, loading: false, error: error};

    case activitiesConstants.GET_ACTIVITIES_CATEGORIES:
      return {...state, loading: true, error: null};
    case activitiesConstants.GET_ACTIVITIES_CATEGORIES_SUCCESS:
      return {...state, loading: false, activities_categories: payload};
    case activitiesConstants.GET_ACTIVITIES_CATEGORIES_FAILURE:
      return {...state, loading: false, error: error};

    default:
      return state;
  }
};