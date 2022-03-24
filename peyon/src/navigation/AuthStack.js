import React from 'react';
import {TouchableOpacity} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';

import SignIn from '../screens/Auth/SignIn';
import SignUp from '../screens/Auth/SignUp/Main';

import {colors} from 'colors';
import Start from '../screens/Auth/Start';
import {routeNames} from 'enums';
import RegisterEmail from 'screens/Auth/SignUp/RegisterEmail';
import ContinueRegister from 'screens/Auth/SignUp/ContinueRegister';
import ForgotPassword from 'screens/Auth/ResetPassword/ForgotPassword';
import VerificationPasswordCode from 'screens/Auth/ResetPassword/VerificationPasswordCode';
import PasswordRecovery from 'screens/Auth/ResetPassword/PasswordRecovery';

const AuthStack = createStackNavigator();

export default props => {
  const {user} = props;

  return (
    <AuthStack.Navigator
      screenOptions={() => ({
        title: null,
        headerShown: false,
        headerStyle: {
          shadowColor: 'transparent',
        },
      })}>
      <AuthStack.Screen name="Start" component={Start} />
      <AuthStack.Screen name={routeNames.signIn} component={SignIn} />
      <AuthStack.Screen name={routeNames.signUp} component={SignUp} />
      <AuthStack.Screen
        name={routeNames.registerEmail}
        component={RegisterEmail}
      />
      <AuthStack.Screen
        name={routeNames.continueRegister}
        component={ContinueRegister}
      />
      <AuthStack.Screen
        name={routeNames.forgotPassword}
        component={ForgotPassword}
      />
      <AuthStack.Screen
        name={routeNames.verificationPasswordCode}
        component={VerificationPasswordCode}
      />
      <AuthStack.Screen
        name={routeNames.passwordRecovery}
        component={PasswordRecovery}
      />
    </AuthStack.Navigator>
  );
};
