import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {routeNames} from 'enums';
import Home from 'screens/Home';
import Details from 'screens/Home/Details';

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
      <HomeStack.Screen
        name={routeNames.dateils}
        component={Details}
      />
    </HomeStack.Navigator>
  );
};
