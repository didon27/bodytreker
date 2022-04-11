import React, { useContext } from 'react';
import { View, Image, TouchableOpacity, StatusBar } from 'react-native';

import { Text } from 'components';
import { colors } from 'colors';
import { routeNames } from 'enums';
import { images } from 'images';
import { LocalizationContext } from 'services';

import styles from './styles';

const Start = props => {
  const { translations } = useContext(LocalizationContext);
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.dimmer} />
      <Image
        resizeMode="cover"
        style={styles.backgroundImage}
        source={images.startBackground}
      />
      <View style={styles.textBlock}>
        <Text style={styles.title}>Peyon</Text>
        {/* <Text style={styles.subtitle}>{translations.tagline}</Text> */}
        <Text style={styles.subtitle}>Вітаємо , ми з України !</Text>
      </View>
      <View style={styles.bottomBlock}>
        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() => props.navigation.navigate(routeNames.signUp)}>
          <Text color={colors.black} size={20} style={{ fontWeight: '600' }}>
            {translations.signUp}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.loginBtn}
          onPress={() => props.navigation.navigate(routeNames.signIn)}>
          <Text color={'#c9c9c9'} size={18} style={{ fontWeight: '600' }}>
            {translations.singIn}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Start;
