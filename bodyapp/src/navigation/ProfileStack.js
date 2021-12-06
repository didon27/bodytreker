import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {routeNames} from 'enums';
import MyProfile from 'screens/MyProfile/Main';
import Settings from 'screens/MyProfile/Settings';
import EditProfile from 'screens/MyProfile/EditProfile';
import MyActivities from 'screens/MyProfile/MyActivities';

const ProfileStack = createStackNavigator();

export default props => {
  return (
    <ProfileStack.Navigator
      screenOptions={() => ({
        title: null,
        headerShown: false,
        headerStyle: {
          shadowColor: 'transparent',
        },
      })}>
      <ProfileStack.Screen name={routeNames.myProfile} component={MyProfile} />
      <ProfileStack.Screen
        name={routeNames.editProfile}
        component={EditProfile}
      />
      <ProfileStack.Screen name={routeNames.settings} component={Settings} />
      <ProfileStack.Screen
        name={routeNames.myActivities}
        component={MyActivities}
      />
    </ProfileStack.Navigator>
  );
};
