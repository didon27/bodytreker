import React from 'react';
import {View, Image, TouchableOpacity, StatusBar} from 'react-native';

import {Text} from 'components';
import {colors} from 'colors';
import {routeNames} from 'enums';
import {images} from 'images';

import styles from './styles';

const Start = props => {
  StatusBar.setBarStyle('light-content');

  return (
    <View style={styles.container}>
      <View style={styles.dimmer} />
      <Image
        resizeMode="cover"
        style={styles.backgroundImage}
        source={images.startBackground}
      />
      <View style={styles.textBlock}>
        <Text style={styles.title}>Archery Tracker</Text>
        <Text style={styles.subtitle}>
          We shoot indoors at the Aspire Centre in Southfields all year round
          and outdoors during the summer
        </Text>
      </View>
      <View style={styles.bottomBlock}>
        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() => props.navigation.navigate(routeNames.signUp)}>
          <Text color={colors.black} size={20} style={{fontWeight: '600'}}>
            Регистрация
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => props.navigation.navigate(routeNames.signIn)}>
          <Text color={'#c9c9c9'} size={18} style={{fontWeight: '600'}}>
            Войти
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Start;
