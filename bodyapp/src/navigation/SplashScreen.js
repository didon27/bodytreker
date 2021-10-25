import React from 'react';
import {View, ActivityIndicator, StyleSheet, Image} from 'react-native';
import {colors} from '_colors';
import {images} from '_images';

const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Image source={images.mamahood} style={styles.logo} resizeMode="contain" />
      <ActivityIndicator
        animating
        color={colors.white}
        size="large"
        style={styles.activityIndicator}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background
  },
  activityIndicator: {
    alignItems: 'center',
    height: 100
  },
  logo: {width: 225, height: 120, marginBottom: 30, marginTop: 60}
});

export default SplashScreen;
