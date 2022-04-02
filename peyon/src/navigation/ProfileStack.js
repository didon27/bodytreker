import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { routeNames } from 'enums';
import MyProfile from 'screens/MyProfile/Main';
import Settings from 'screens/MyProfile/Settings';
import EditProfile from 'screens/MyProfile/EditProfile';
import Activities from 'screens/Activities';
import ActivityStack from './ActivityStack';
import FollowersAndFollowings from 'screens/FollowersAndFollowings';
import UserProfile from 'screens/UserProfile';
import ActivityEdit from 'screens/ActivityEdit';
import ChangePassword from 'screens/MyProfile/ChangePassword';
import Information from 'screens/MyProfile/Information';

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
        name={routeNames.activityEdit}
        component={ActivityEdit}
      />
      <ProfileStack.Screen
        name={routeNames.userProfile}
        component={UserProfile}
      />
      <ProfileStack.Screen
        name={routeNames.editProfile}
        component={EditProfile}
      />
      <ProfileStack.Screen
        name={routeNames.changePassword}
        component={ChangePassword}
      />
      <ProfileStack.Screen
        name={routeNames.information}
        component={Information}
      />
      <ProfileStack.Screen name={routeNames.settings} component={Settings} />
      <ProfileStack.Screen
        name={routeNames.activities}
        component={Activities}
      />
      <ProfileStack.Screen
        name={routeNames.followersAndFollowings}
        component={FollowersAndFollowings}
      />
      <ProfileStack.Screen
        name={routeNames.dateils}
        component={ActivityStack}
      />
    </ProfileStack.Navigator>
  );
};
