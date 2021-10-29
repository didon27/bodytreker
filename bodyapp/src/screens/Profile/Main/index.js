import React from 'react';
import {
  StatusBar,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
} from 'react-native';
import StarRating from 'react-native-star-rating';

import {colors} from 'colors';
import {authActions} from 'store/auth';
import {View, Text, Button} from 'components';
import {images} from 'images';
import {useSelector, useDispatch} from 'react-redux';

import styles from './styles';
import {storage} from 'services/storage';

const Profile = props => {
  const {user} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const containerStyle = {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#21212f',
  };

  const logout = async () => {
    await storage.delete('UserToken');
    dispatch(authActions.removeTokenSuccess());
  };
  return (
    <View flex style={{backgroundColor: 'white', flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View>
        <Text>{`Hi, ${user.username}`}</Text>
        <TouchableOpacity onPress={logout}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
