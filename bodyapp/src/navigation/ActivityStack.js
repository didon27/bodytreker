import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {routeNames} from 'enums';
import ActivityDetails from 'screens/ActivitiyDetails';

const ActivityStack = createStackNavigator();

export default props => {
  console.log('fsdfsdf', props);

  return (
    <ActivityStack.Navigator
      initialRouteName={'ActivityStack'}
      screenOptions={({navigation, route}) => ({
        headerShown: false,
      })}>
      <ActivityStack.Screen
        name={routeNames.activityDetails}
        component={ActivityDetails}
        {...props}
      />
    </ActivityStack.Navigator>
  );
};
