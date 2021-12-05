import React, {
  useContext,
  useEffect,
  activityef,
  useState,
  useRef,
} from 'react';
import {Animated, StatusBar, TouchableOpacity} from 'react-native';
import StarRating from 'react-native-star-rating';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIonicons from 'react-native-vector-icons/Ionicons';

import {activitiesActions} from 'store/activities';
import Header from './components/Header';
import {colors} from 'colors';
import {authActions} from 'store/auth';
import {View, Text, ItemCategory, Button, Avatar} from 'components';
import {storage} from 'services/storage';
import {LocalizationContext} from 'services';
import ActivitiesCard from 'screens/Home/components/ActivitiesCard';

import styles from './styles';
import {routeNames} from 'enums';

const ActivityDetails = ({navigation, route}) => {
  console.log('FSDFSDFSDFSDF', route.params);
  const {activity} = route.params;
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const AnimatedIcon = Animated.createAnimatedComponent(Icon);
  const AnimatedIconIonicons = Animated.createAnimatedComponent(IconIonicons);
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);
  const {translations, appLanguage} = useContext(LocalizationContext);
  const {myActivities} = useSelector(state => state.activities);
  const [tab, setTab] = useState(true);

  useEffect(() => {
    StatusBar.setHidden(true);
    dispatch(activitiesActions.getMyActivities({activity_id: activity.id}));
  }, [appLanguage]);

  const logout = async () => {
    await storage.delete('activityToken');
    dispatch(authActions.removeTokenSuccess());
  };

  let inputRageHeader = activity.activities_images.length
    ? [0, 100, 220, 340]
    : [0, 20, 30, 60];

  let inputRageHeaderButton = activity.activities_images.length
    ? [0, 100, 340]
    : [0, 30, 60];

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

  const headeractivitynameColor = scrollY.interpolate({
    inputRange: inputRageHeader,
    outputRange: ['transparent', 'transparent', 'transparent', 'black'],
    extrapolate: 'clamp',
  });

  const returnPartner = partner => {
    if (partner === 0) {
      return translations.a_man;
    } else if (partner === 1) {
      return translations.a_women;
    } else if (partner === 2) {
      return translations.by_the_company;
    } else {
      return translations.all_the_same;
    }
  };

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
            onPress={() => navigation.goBack()}
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
              color: headeractivitynameColor,
              fontSize: 20,
              fontWeight: '500',
            }}>
            {/* {activity.activityname.toLocaleLowerCase()} */}
          </Animated.Text>
          <AnimatedTouchableOpacity
            onPress={() => navigation.navigate(routeNames.settings, {activity})}
            style={{
              ...styles.secondHeaderBtn,
              backgroundColor: headerButtonBackgroundColor,
            }}>
            <AnimatedIconIonicons
              name={'ellipsis-vertical'}
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
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {contentOffset: {y: scrollY}},
            },
          ],
          {useNativeDriver: false},
        )}>
        <Header
          translations={translations}
          myActivities={myActivities}
          tab={tab}
          navigation={navigation}
          activity={activity}
          setTab={setTab}
        />
        <View style={{padding: 20}}>
          <Text size={20} bold mBottom={20}>
            {activity.title}
          </Text>
          <Text>{returnPartner(activity?.partner)}</Text>
          {activity.description ? (
            <View mBottom={16}>
              <Text size={18} style={{fontWeight: '600'}}>
                {translations.description}
              </Text>
              <Text
                mTop={8}
                size={16}
                style={{fontWeight: '500'}}
                color={'#afafaf'}>
                {activity.description}
              </Text>
            </View>
          ) : null}
          <View>
            <Text size={18} style={{fontWeight: '600'}} mBottom={8}>
              Подписчики
            </Text>
            {activity.subscribers.length ? (
              activity.subscribers.map((subscriber, index) => (
                <View row>
                  <Avatar user={subscriber} />
                  <View mLeft={10}>
                    <Text size={15} style={{fontWeight: '500'}}>
                      {subscriber.username}
                    </Text>
                    <View style={{width: 10}}>
                      <StarRating
                        starStyle={{marginHorizontal: 1, marginTop: 2}}
                        disabled={false}
                        maxStars={5}
                        starSize={10}
                        rating={subscriber.rating}
                        emptyStarColor="#A2A3A5"
                        fullStarColor={'#F5B942'}
                      />
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View>
                <Text size={16} style={{fontWeight: '500'}} color={'#afafaf'}>
                  Пока что нету участников, стань первым
                </Text>
              </View>
            )}
          </View>
          <View row centered style={{flexWrap: 'wrap', marginTop: 16}}>
            {activity.activities_categories.map((e, i) => (
              <ItemCategory key={i} item={e} />
            ))}
          </View>
          <Button
            text={!activity.subscribe ? 'Подписаться' : 'Отписаться'}
            style={{height: 40}}
          />
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default ActivityDetails;
