import React, {useContext, useEffect, useState, useRef} from 'react';
import {Animated, StatusBar, TouchableOpacity, TextInput} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIonicons from 'react-native-vector-icons/Ionicons';

import {activitiesActions} from 'store/activities';
import Header from './components/Header';
import {colors} from 'colors';
import {authActions} from 'store/auth';
import {
  View,
  Text,
  ItemCategory,
  Button,
  UserBlock,
  SubscribeButton,
} from 'components';
import {storage} from 'services/storage';
import {LocalizationContext} from 'services';

import styles from './styles';
import {routeNames} from 'enums';
import moment from 'moment';
import axios from 'axios';
import {API_URL} from 'constants';

const ActivityEdit = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const AnimatedIcon = Animated.createAnimatedComponent(Icon);
  const AnimatedIconIonicons = Animated.createAnimatedComponent(IconIonicons);
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);
  const {translations, appLanguage} = useContext(LocalizationContext);
  const {myActivities, subscribeActivityLoading} = useSelector(
    state => state.activities,
  );
  const {user} = useSelector(state => state.user);
  const {token} = useSelector(state => state.auth);

  const [activity, setActivity] = useState(route.params.activity || {});

  const fetchData = () => {
    axios({
      method: 'post',
      url: `${API_URL}/activities/get-activity`,
      data: {activity_id: route.params.activity.id},
      headers: {
        'accept-language': appLanguage,
        Authorization: token,
      },
    })
      .then(response => {
        setActivity(response.data);
      })
      .catch(err => {
        console.log('error', err.response.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    StatusBar.setHidden(true);
    dispatch(activitiesActions.getMyActivities({activity_id: activity.id}));
  }, [appLanguage]);

  let inputRageHeader = activity?.activities_images.length
    ? [0, 100, 220, 340]
    : [0, 20, 30, 60];

  let inputRageHeaderButton = activity?.activities_images.length
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

  const subscribeControl = (data, subscribe, item) => {
    if (subscribe) {
      dispatch(activitiesActions.unsubscribeActivity(data, fetchData));
    } else {
      dispatch(activitiesActions.subscribeActivitiy(data, item, fetchData));
    }
  };

  const changeField = (key, value) => {
    setActivity(prevState => ({...prevState, [key]: value}));
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
        <Header navigation={navigation} activity={activity} />
        <View style={{padding: 20}}>
          <TextInput
            multiline
            maxLength={250}
            style={{fontSize: 20, fontWeight: '700', marginBottom: 16}}
            value={activity.title}
            onChangeText={value => changeField('title', value)}
            placeholder={translations.title}
          />
          <TextInput
            multiline
            maxLength={250}
            style={{minHeight: 100, fontSize: 15}}
            value={activity.description}
            onChangeText={value => changeField('description', value)}
            placeholder={translations.description}
          />
          {/* {activity.description ? (
            <Text size={16} style={{fontWeight: '500'}} color={'#afafaf'}>
              {activity.description}
            </Text>
          ) : null} */}
          <Text size={16} mTop={4} medium>
            {moment(activity.createdAt).startOf('hour').fromNow()}
          </Text>
          <View mTop={16} row>
            <Text size={16} style={{fontWeight: '500'}} color={'#afafaf'}>
              Хочу выполнить это с{' '}
            </Text>
            <Text size={16} medium>
              {returnPartner(activity?.partner).toUpperCase()}
            </Text>
          </View>
          {activity.activities_categories.length ? (
            <View row centered style={{flexWrap: 'wrap', marginTop: 8}}>
              {activity.activities_categories.map((e, i) => (
                <ItemCategory key={i} item={e} />
              ))}
            </View>
          ) : null}
          <View mTop={16}>
            <Text size={18} style={{fontWeight: '600'}} mBottom={8}>
              {translations.followers}{' '}
              <Text size={16} color={colors.grey}>
                ({activity.subscribers.length})
              </Text>
            </Text>
            {activity.subscribers.length ? (
              activity.subscribers.map((subscriber, index) => (
                <UserBlock
                  navigation={navigation}
                  user={subscriber}
                  key={index}
                  containerStyle={{marginBottom: 8}}
                />
              ))
            ) : (
              <View>
                <Text size={16} style={{fontWeight: '500'}} color={'#afafaf'}>
                  Пока что нету участников, стань первым
                </Text>
              </View>
            )}
          </View>
          <SubscribeButton
            loading={subscribeActivityLoading}
            onPress={() =>
              subscribeControl(
                {user_id: user.id, activity_id: activity.id},
                activity.subscribe,
                activity,
              )
            }
            textStyle={{fontSize: 15}}
            style={{height: 36, marginTop: 20}}
            subscribe={activity.subscribe}
            text={
              user.id === activity.user.id
                ? translations.edit
                : activity.subscribe
                ? translations.following
                : translations.follow
            }
          />
          {/* <Button
            onPress={() =>
              subscribeControl(
                {user_id: user.id, activity_id: activity.id},
                activity.subscribe,
                activity,
              )
            }
            loading={subscribeActivityLoading}
            text={!activity.subscribe ? 'Подписаться' : 'Отписаться'}
            style={{height: 40}}
          /> */}
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default ActivityEdit;
