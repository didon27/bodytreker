import React, {useContext, useEffect, useRef, useState} from 'react';
import {Animated, TouchableOpacity} from 'react-native';
import StarRating from 'react-native-star-rating';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import {activitiesActions} from 'store/activities';
import Header from './components/Header';
import {colors} from 'colors';
import {authActions} from 'store/auth';
import {View, Text} from 'components';
import {storage} from 'services/storage';
import {LocalizationContext} from 'services';
import ActivitiesCard from 'screens/Home/components/ActivitiesCard';

import styles from './styles';

const Profile = props => {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const {user} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const AnimatedIcon = Animated.createAnimatedComponent(Icon);
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);
  const {translations, appLanguage} = useContext(LocalizationContext);
  const {myActivities} = useSelector(state => state.activities);
  const [tab, setTab] = useState(true);

  useEffect(() => {
    dispatch(activitiesActions.getMyActivities({user_id: user.id}));
  }, [appLanguage]);

  const logout = async () => {
    await storage.delete('UserToken');
    dispatch(authActions.removeTokenSuccess());
  };

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 100, 220, 340],
    outputRange: ['transparent', 'transparent', 'transparent', 'white'],
    extrapolate: 'clamp',
  });

  const headerBorderColor = scrollY.interpolate({
    inputRange: [0, 100, 220, 340],
    outputRange: ['transparent', 'transparent', 'transparent', '#dddcdc'],
    extrapolate: 'clamp',
  });

  const headerButtonBackgroundColor = scrollY.interpolate({
    inputRange: [0, 100, 340],
    outputRange: ['#0000005c', '#0000005c', 'transparent'],
    extrapolate: 'clamp',
  });

  const headerButtonColor = scrollY.interpolate({
    inputRange: [0, 100, 220, 340],
    outputRange: ['white', 'white', 'white', colors.mainBlue],
    extrapolate: 'clamp',
  });

  const headerUsernameColor = scrollY.interpolate({
    inputRange: [0, 100, 220, 340],
    outputRange: ['transparent', 'transparent', 'transparent', 'black'],
    extrapolate: 'clamp',
  });

  function renderItem({item, index}) {
    return (
      <View style={{paddingHorizontal: 20}}>
        <ActivitiesCard
          navigation={props.navigation}
          item={item}
          index={index}
          user_id={user.id}
          translations={translations}
        />
      </View>
    );
  }

  return (
    <View flex style={{backgroundColor: colors.white}}>
      <Animated.View
        style={{
          ...styles.headerContainer,
          backgroundColor: headerBackgroundColor,
          paddingTop: insets.top,
        }}>
        <View style={styles.header}>
          <AnimatedTouchableOpacity
            style={{
              ...styles.btnBack,
              backgroundColor: headerButtonBackgroundColor,
            }}>
            <AnimatedIcon
              name="angle-left"
              size={30}
              style={{color: headerButtonColor}}
            />
          </AnimatedTouchableOpacity>
          <Animated.Text
            style={{
              color: headerUsernameColor,
              fontSize: 20,
              fontWeight: '500',
            }}>
            {user.username.toLocaleLowerCase()}
          </Animated.Text>
          <AnimatedTouchableOpacity
            style={{
              ...styles.secondHeaderBtn,
              backgroundColor: headerButtonBackgroundColor,
            }}>
            <AnimatedIcon
              name={'gears'}
              size={24}
              style={{color: headerButtonColor}}
            />
          </AnimatedTouchableOpacity>
        </View>
        <Animated.View
          style={{
            width: '100%',
            height: 0.5,
            backgroundColor: headerBorderColor,
          }}
        />
      </Animated.View>
      <Animated.FlatList
        bounces={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {contentOffset: {y: scrollY}},
            },
          ],
          {useNativeDriver: false},
        )}
        initialNumToRender={2}
        snapToAlignment="start"
        decelerationRate="fast"
        maxToRenderPerBatch={1}
        windowSize={5}
        onEndReachedThreshold={0.9}
        removeClippedSubviews
        ListEmptyComponent={() => (
          <View style={{paddingHorizontal: 20, paddingBottom: 20}}>
            <View>
              <Text size={18} style={{fontWeight: '600'}}>
                About me
              </Text>
              <Text
                mTop={8}
                size={16}
                style={{fontWeight: '500'}}
                color={'#afafaf'}>
                {user.description}
              </Text>
            </View>
            <View mTop={22} row style={styles.ratingContainer}>
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
            </View>
          </View>
          // <View
          //   style={{
          //     width: '100%',
          //     height: DEVICE_HEIGHT * 0.7,
          //     alignItems: 'center',
          //     justifyContent: 'center',
          //   }}>
          //   <Text>К сожелению нету активити</Text>
          // </View>
        )}
        removeClippedSubviews={true}
        ItemSeparatorComponent={() => <View style={{height: 16}} />}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Header
            translations={translations}
            myActivities={myActivities}
            tab={tab}
            user={user}
            setTab={setTab}
          />
        }
        contentContainerStyle={styles.flatList}
        data={tab ? [] : myActivities}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

export default Profile;
