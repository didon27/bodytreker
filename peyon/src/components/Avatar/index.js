import { colors } from 'colors';
import { Text, View } from 'components';
import { API } from 'constants';
import React from 'react';
import { StyleSheet } from 'react-native';
import FastImage from 'react-native-fast-image';

const Avatar = ({ user, style, edit, letterStyle }) => {
  const styles = StyleSheet.create({
    avatar: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.lightGrey },
  });

  const generateLetter = string => {
    return string && string.length
      ? string.substr(0, 1).toLocaleUpperCase()
      : '';
  };


  if (user.avatar) {
    return (
      <FastImage
        source={{ uri: edit ? user.avatar : API + '/images/' + user.avatar }}
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
