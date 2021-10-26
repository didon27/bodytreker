import React from 'react';
import {View, StatusBar, Text, TouchableOpacity} from 'react-native';

import {colors} from 'colors';
import {authActions} from 'store/auth';
import {images} from 'images';
import {useSelector, useDispatch} from 'react-redux';

import styles from './styles';
import {storage} from 'services/storage';

const Home = props => {
  const {user} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const containerStyle = {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
  };

  const logout = async () => {
    await storage.delete('UserToken');
    dispatch(authActions.removeTokenSuccess());
  };

  return (
    <>
      <StatusBar animated barStyle={'dark-content'} />
      <View style={containerStyle}>
        <Text>{`Hi, ${user.username}`}</Text>
        <TouchableOpacity onPress={logout}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Home;
