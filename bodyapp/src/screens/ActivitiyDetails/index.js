import React, {useContext, useEffect, useState, useRef} from 'react';
import {Animated, StatusBar, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import StarRating from 'react-native-star-rating-widget';

import {activitiesActions} from 'store/activities';
import Header from './components/Header';
import {colors} from 'colors';
import Modal from 'react-native-modal';
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
import {mamaAxios} from 'services/api';

const ActivityDetails = ({navigation, route}) => {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const AnimatedIcon = Animated.createAnimatedComponent(Icon);
  const AnimatedIconIonicons = Animated.createAnimatedComponent(IconIonicons);
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);
  const {translations, appLanguage} = useContext(LocalizationContext);
  const {subscribeActivityLoading} = useSelector(state => state.activities);
  const {user} = useSelector(state => state.user);
  const [hideRateModal, setHideRateModal] = useState(false);
  const [activity, setActivity] = useState(route.params.activity);
  const [firstRating, setFirstRating] = useState(null);
  const [secondRating, setSecondRating] = useState(null);
  const [thirdRating, setThirdRating] = useState(null);

  const fetchData = () => {
    mamaAxios
      .post(`${API_URL}/activities/get-activity`, {
        activity_id: route.params.activity.id,
      })
      .then(response => {
        setActivity(response.data);
      })
      .catch(err => {
        console.log('error', err.response.data);
      });
  };

  const inviteUserActivity = user_id => {
    mamaAxios
      .post(`${API_URL}/activities/invite-user-activity`, {
        activity_id: route.params.activity.id,
        user_id: user_id,
        status: 1,
      })
      .then(response => {
        fetchData();
      })
      .catch(err => {
        console.log('error', err.response.data);
      });
  };

  const rateUser = () => {
    mamaAxios
      .post(`${API_URL}/user/rate-user`, {
        user_id: activity.user.id,
        activity_id: activity.id,
        first_rating: firstRating,
        second_rating: secondRating,
        third_rating: thirdRating,
      })
      .then(response => {
        setHideRateModal(false);
        fetchData();
      })
      .catch(err => {
        console.log('error', err.response.data);
      });
  };

  useEffect(() => {
    StatusBar.setHidden(true);
    fetchData();
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

  return (
    <View flex style={{backgroundColor: colors.white}}>
      <Modal isVisible={hideRateModal}>
        <View style={{backgroundColor: 'white', padding: 16, borderRadius: 12}}>
          <TouchableOpacity
            onPress={() => setHideRateModal(false)}
            style={{alignItems: 'flex-end'}}>
            <Icon name={'close'} size={24} color={'grey'} />
          </TouchableOpacity>
          <Text mBottom={24} medium size={18} center>
            Для того что бы заверишить действие оцените пользователя
          </Text>
          <Text mBottom={4}>Приятность в общение</Text>
          <StarRating
            starSize={40}
            rating={firstRating}
            onChange={setFirstRating}
          />
          <Text mBottom={4} mTop={16}>
            Соответствие профилю
          </Text>
          <StarRating
            starSize={40}
            rating={secondRating}
            onChange={setSecondRating}
          />
          <Text mBottom={4} mTop={16}>
            Осознаность
          </Text>
          <StarRating
            starSize={40}
            rating={thirdRating}
            onChange={setThirdRating}
          />
          <View row centered mTop={24}>
            <TouchableOpacity
              style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
              <Text size={16}>Пропустить</Text>
            </TouchableOpacity>
            <Button
              text={'Завершить'}
              onPress={rateUser}
              style={{
                marginTop: 24,
                height: 40,
                width: null,
                flex: 1,
                marginTop: 0,
              }}
            />
          </View>
        </View>
      </Modal>
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
          <Text size={18} mBottom={8}>
            {activity.title}
          </Text>
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
          <View mTop={24}>
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
                  statusBtn
                  buttonControl={inviteUserActivity}
                  myId={user.id}
                  authorActivity={activity.user.id}
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
          {!activity?.your_status && (
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
              style={{height: 40, marginTop: 20}}
              subscribe={activity.subscribe}
              text={
                user.id === activity.user.id
                  ? translations.edit
                  : activity.subscribe
                  ? translations.following
                  : translations.follow
              }
            />
          )}
          {user.id !== activity.user.id &&
            activity.subscribe &&
            activity?.your_status && (
              <Button
                onPress={() => setHideRateModal(true)}
                text={'Завершить'}
                style={{height: 40, marginTop: 16, backgroundColor: 'grey'}}
              />
            )}
          <Text mTop={16} color={colors.grey} center>
            Перед завершения действия вы cможете оценить взаимодествие с
            пользователем
          </Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
};

export default ActivityDetails;
