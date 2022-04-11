import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { routeNames } from 'enums';
import Chats from 'screens/Chats/Main';
import Chat from 'screens/Chats/Chat';

const ChatsStack = createStackNavigator();

export default props => {
  return (
    <ChatsStack.Navigator
      screenOptions={() => ({
        title: null,
        headerShown: false,
        headerStyle: {
          shadowColor: 'transparent',
        },
      })}>
      <ChatsStack.Screen name={routeNames.chats} component={Chats} />
      <ChatsStack.Screen name={routeNames.chat} component={Chat} />
    </ChatsStack.Navigator>
  );
};
