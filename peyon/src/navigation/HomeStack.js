import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {routeNames} from 'enums';
import Home from 'screens/Home';
import ActivityStack from './ActivityStack';
import UserProfile from 'screens/UserProfile';
import Activities from 'screens/Activities';
import FollowersAndFollowings from 'screens/FollowersAndFollowings';

const HomeStack = createStackNavigator();

export default props => {
  return (
    <HomeStack.Navigator
      screenOptions={() => ({
        title: null,
        headerShown: false,
        headerStyle: {
          shadowColor: 'transparent',
        },
      })}>
      <HomeStack.Screen name={routeNames.home} component={Home} />
      <HomeStack.Screen name={routeNames.dateils} component={ActivityStack} />
      <HomeStack.Screen name={routeNames.userProfile} component={UserProfile} />
      <HomeStack.Screen name={routeNames.activities} component={Activities} />
      <HomeStack.Screen
        name={routeNames.followersAndFollowings}
        component={FollowersAndFollowings}
      />
    </HomeStack.Navigator>
  );
};
