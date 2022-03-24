import {combineReducers} from 'redux';
import {activitiesReducer} from './activities';

import {authReducer} from './auth';
import {userReducer} from './user';

export default combineReducers({
  auth: authReducer,
  user: userReducer,
  activities: activitiesReducer,
});
