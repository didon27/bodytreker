import React, {useEffect, createRef} from 'react';
import SplashScreen from 'react-native-splash-screen';

import {storage} from 'services/storage';

import {useSelector, useDispatch} from 'react-redux';

import AuthStack from './AuthStack';
import MainStack from './MainStack';

import {authActions} from 'store/auth';
import {userActions} from 'store/user';

export const navigationRef = createRef();

export function navigate(name, params = {}) {
  navigationRef.current?.navigate(name, params);
}

const Navigation = props => {
  const {user} = useSelector(state => state.user);
  const {tokenLoading, token} = useSelector(state => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    // storage.delete('UserToken');
    const handleToken = async () =>
      dispatch(authActions.setToken(await storage.get('UserToken')));
    handleToken();
  }, []);

  useEffect(() => {
    !tokenLoading && SplashScreen.hide();
  }, [tokenLoading]);
  
  if (!tokenLoading) {
    if (!token) {
      return <AuthStack />;
    } else {
      return <MainStack />;
    }
  } else {
    return null;
  }
};

export default Navigation;
