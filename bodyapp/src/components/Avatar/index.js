import {colors} from 'colors';
import {Text, View} from 'components';
import {API} from 'constants';
import React from 'react';
import {Image, StyleSheet} from 'react-native';

const Avatar = ({user, style, edit, letterStyle}) => {
  const styles = StyleSheet.create({
    avatar: {width: 34, height: 34, borderRadius: 17},
  });

  const generateLetter = string => {
    return string && string.length
      ? string.substr(0, 1).toLocaleUpperCase()
      : '';
  };

  if (user.avatar) {
    return (
      <Image
        source={{uri: edit ? user.avatar : API + '/images/' + user.avatar}}
        style={[styles.avatar, style && style]}
      />
    );
  } else {
    return (
      <View
        style={[
          {
            ...styles.avatar,
            backgroundColor: colors.mainBlue,
            justifyContent: 'center',
            alignItems: 'center',
          },
          style && style,
        ]}>
        <Text
          size={20}
          medium
          color={colors.white}
          style={letterStyle && letterStyle}>
          {user.first_name
            ? generateLetter(user.first_name)
            : generateLetter(user.username)}
        </Text>
      </View>
    );
  }
};

export default Avatar;
