import React from 'react';
import {TouchableOpacity} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import SignIn from '../screens/Auth/SignIn';
import SignUp from '../screens/Auth/SignUp/Main';

import {colors} from '_colors';

const AuthStack = createStackNavigator();

export default props => {
  const {user} = props;

  return (
    <AuthStack.Navigator
      screenOptions={() => ({
        title: null,
        headerStyle: {
          shadowColor: 'transparent',
        },
      })}>
      <AuthStack.Screen
        name="SignIn"
        component={SignIn}
        options={() => ({
          headerShown: false,
        })}
      />
      <AuthStack.Screen
        name="SignUp"
        component={SignUp}
        options={({navigation}) => ({
          headerShown: false,
        })}
      />
    </AuthStack.Navigator>
  );
};
