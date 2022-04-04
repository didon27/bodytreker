import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Linking, StatusBar, TouchableOpacity } from 'react-native';
import StarRating from 'react-native-star-rating';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { activitiesActions } from 'store/activities';
import Header from './components/Header';
import { colors } from 'colors';
import { authActions } from 'store/auth';
import { View, Text } from 'components';
import { storage } from 'services/storage';
import { LocalizationContext } from 'services';
import { routeNames } from 'enums';

import styles from './styles';

const Profile = ({ user, navigation, headerButtonControl, myAccount }) => {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const AnimatedIcon = Animated.createAnimatedComponent(Icon);
  const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);
  const { translations, appLanguage } = useContext(LocalizationContext);
  const { myActivities } = useSelector(state => state.activities);

  useEffect(() => {
    StatusBar.setHidden(true);
    dispatch(activitiesActions.getMyActivities({ user_id: user.id }));
  }, [appLanguage]);

  let inputRageHeader = user?.images.length
    ? [0, 100, 220, 340]
    : [0, 20, 30, 60];

  let inputRageHeaderButton = user?.images.length ? [0, 100, 340] : [0, 30, 60];

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: inputRageHeader,
    outputRange: ['transparent', 'transparent', 'transparent', 'white'],
    extrapolate: 'clamp',
  });

  const headerBorderColor = scrollY.interpolate({
    inputRange: inputRageHeader,
    outputRange: ['transparent', 'transparent', 'transparent', '#dddcdc'],
    extrapolate: 'clamp',
  });

  const headerButtonBackgroundColor = scrollY.interpolate({
    inputRange: inputRageHeaderButton,
    outputRange: ['#0000005c', '#0000005c', 'transparent'],
    extrapolate: 'clamp',
  });

  const headerButtonColor = scrollY.interpolate({
    inputRange: inputRageHeader,
    outputRange: ['white', 'white', 'white', colors.mainBlue],
    extrapolate: 'clamp',
  });

  const headerUsernameColor = scrollY.interpolate({
    inputRange: inputRageHeader,
    outputRange: ['transparent', 'transparent', 'transparent', 'black'],
    extrapolate: 'clamp',
  });
  const tel = `http://t.me/${user.telegram}`;
  const inst = `https://www.instagram.com/${user.instagram}`;


  const openTelegram = () => {
    Linking.openURL(tel).catch(err => console.error('An error occurred', err))
  };
  const openInstagram = () => {
    Linking.openURL(inst).catch(err => console.error('An error occurred', err))
  };

  return (
    <View flex style={{ backgroundColor: colors.white }}>
      <Animated.View
        style={{
          ...styles.headerContainer,
          backgroundColor: headerBackgroundColor,
          paddingTop: insets.top,
        }}>
        <View style={styles.header}>
          {!myAccount && (
            <AnimatedTouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                ...styles.btnBack,
                backgroundColor: headerButtonBackgroundColor,
              }}>
              <AnimatedIcon
                name="angle-left"
                size={30}
                style={{ color: headerButtonColor }}
              />
            </AnimatedTouchableOpacity>
          )}
          <Animated.Text
            style={{
              color: headerUsernameColor,
              fontSize: 20,
              fontWeight: '500',
            }}>
            {user.username.toLocaleLowerCase()}
          </Animated.Text>
          {myAccount ? (
            <AnimatedTouchableOpacity
              onPress={() => navigation.navigate(routeNames.settings, { user })}
              style={{
                ...styles.secondHeaderBtn,
                backgroundColor: headerButtonBackgroundColor,
              }}>
              <AnimatedIcon
                name={'gears'}
                size={24}
                style={{ color: headerButtonColor }}
              />
            </AnimatedTouchableOpacity>
          ) : null
          //  (
          //   <AnimatedTouchableOpacity
          //     onPress={() => navigation.navigate(routeNames.settings, { user })}
          //     style={{
          //       ...styles.secondHeaderBtn,
          //       backgroundColor: headerButtonBackgroundColor,
          //     }}>
          //     <AnimatedIonicons
          //       name={'ios-chatbubbles'}
          //       size={24}
          //       style={{ color: headerButtonColor }}
          //     />
          //   </AnimatedTouchableOpacity>
          // )
          }
        </View>
        <Animated.View
          style={{
            width: '100%',
            height: 0.5,
            backgroundColor: headerBorderColor,
          }}
        />
      </Animated.View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y: scrollY } },
            },
          ],
          { useNativeDriver: false },
        )}>
        <Header
          translations={translations}
          myActivities={myActivities}
          myAccount={myAccount}
          headerButtonControl={headerButtonControl}
          navigation={navigation}
          user={user}
        />
        <View style={{ padding: 20 }}>
          <Text size={18} medium>
            {translations.socialNetwork}
          </Text>
          <View >
            {user.telegram ?
              (<View row centered mTop={8}>
                <Icon name="telegram" size={24} color={colors.mainBlue} />
                <AnimatedTouchableOpacity
                  onPress={() => openTelegram()}
                >
                  <Text
                    size={16}
                    mLeft={8}
                    style={{ fontWeight: '500' }}
                    color={colors.mainBlue}>
                    @{user.telegram}
                  </Text>
                </AnimatedTouchableOpacity>
              </View>) : null
            }
            {user.instagram ?
              (<View row centered mTop={8}>
                <Icon name="instagram" size={24} color={colors.mainBlue} />
                <AnimatedTouchableOpacity
                  onPress={() => openInstagram()}
                >
                  <Text
                    size={16}
                    mLeft={8}
                    style={{ fontWeight: '500' }}
                    color={colors.mainBlue}>
                    @{user.instagram}
                  </Text>
                </AnimatedTouchableOpacity>
              </View>) : null}
          </View>
          {user.description && user.description !== 'null' ? (
            <View mBottom={22} mTop={16}>
              <Text size={18} medium>
                {translations.aboutMe}
              </Text>
              <Text
                mTop={8}
                size={16}
                style={{ fontWeight: '500' }}
                color={'#afafaf'}>
                {user.description}
              </Text>
            </View>
          ) : null}
          {/* <View>
            <Text>Интересы</Text>
          </View>
          <View row style={styles.ratingContainer}>
            <View jCenter>
              <Text size={34} style={{fontWeight: '700'}}>
                {user.rating}
                <Text size={20}> /5</Text>
              </Text>
              <Text mTop={4} size={16} color={'#bbbbbb'}>
                Based on 120 Reviews
              </Text>
              <View mTop={10}>
                <StarRating
                  rating={user.rating}
                  starStyle={{marginHorizontal: 1, marginTop: 2}}
                  disabled={false}
                  maxStars={5}
                  starSize={26}
                  emptyStarColor="#A2A3A5"
                  fullStarColor={'#fbbf2d'}
                />
              </View>
            </View>
            <View flex></View>
          </View> */}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default Profile;