import React, {useContext} from 'react';
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
import {LocalizationContext} from 'services';

const Profile = props => {
  const {user} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const {translations, setAppLanguage, appLanguage} =
    useContext(LocalizationContext);

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
    <View
      flex
      style={{
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View>
        <Text>{`Hi, ${user.username}`}</Text>
        <View row mTop={20} mBottom={20}>
          <Text>{translations.singIn}</Text>
          <TouchableOpacity onPress={() => setAppLanguage('ua')}>
            <Text>UA</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAppLanguage('ru')}>
            <Text>RU</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAppLanguage('en')}>
            <Text>RU</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={logout}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;
