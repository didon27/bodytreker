import React, {useContext, useEffect, useState, useRef, useMemo} from 'react';
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
import {DefaultBackDrop} from 'components/BackDrop';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';

const ActivityEdit = ({navigation, route}) => {
  const [categoryTitle, setCategoryTitle] = useState('');
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const AnimatedIcon = Animated.createAnimatedComponent(Icon);
  const AnimatedIconIonicons = Animated.createAnimatedComponent(IconIonicons);
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);
  const {translations, appLanguage} = useContext(LocalizationContext);
  const {activities_categories, loading, subscribeActivityLoading} =
    useSelector(state => state.activities);

  const [currentCategories, setCurrentCategories] = useState([]);
  const snapPoints = useMemo(() => ['25%', '70%'], []);
  const bottomSheetRef = useRef();
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
    let data = {};

    if (categoryTitle.length > 3) {
      data.title = categoryTitle;
    }

    dispatch(activitiesActions.getActivitiesCategories(data));
  }, [appLanguage, categoryTitle]);

  useEffect(() => {
    if (activity?.activities_categories) {
      setCurrentCategories(activity.activities_categories.map(el => el.id));
    }
  }, [activity]);

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

  const changeSelected = id => {
    let categories = [...currentCategories];

    if (currentCategories.includes(id)) {
      categories = currentCategories.filter(el => el !== id);
    } else if (currentCategories.length < 3) {
      categories.push(id);
    } else {
      return;
    }

    setCurrentCategories(categories);
  };

  console.log(activity.activities_categories);
  console.log(currentCategories);

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
          <View style={styles.block} mTop={16}>
            <View row centered sBetween>
              <Text size={18} style={{fontWeight: '600'}}>
                {translations.categories}
              </Text>
              <TouchableOpacity
                onPress={() => bottomSheetRef.current.present()}>
                <Text color={colors.mainBlue} style={{fontWeight: '600'}}>
                  {translations.add}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 8}}>
              {currentCategories.length ? (
                currentCategories.map((el, index) => {
                  let item = activities_categories[el - 1];
                  return (
                    <ItemCategory
                      key={index}
                      item={item}
                      changeSelected={changeSelected}
                    />
                  );
                })
              ) : (
                <View style={styles.messageAddCategories}>
                  <Text size={16} color="grey">
                    {translations.add_categories_maximum}
                  </Text>
                </View>
              )}
            </View>
          </View>
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
      <BottomSheetModal
        onDismiss={() => setCategoryTitle('')}
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={DefaultBackDrop}>
        <View style={styles.sheet}>
          <Text size={20}>{translations.select_categories}</Text>
          <TextInput
            placeholder={translations.category_search}
            style={styles.categorySearch}
            onChangeText={setCategoryTitle}
          />
        </View>
        <BottomSheetScrollView
          style={{paddingHorizontal: 20, paddingBottom: 20}}>
          {activities_categories.map((item, index) => {
            let selected = currentCategories.includes(item.id);
            return (
              <TouchableOpacity
                disabled={
                  currentCategories.length >= 3 &&
                  !currentCategories.includes(item.id)
                }
                onPress={() => changeSelected(item.id)}
                key={index}
                style={{
                  ...styles.categoryContainer,
                  borderColor: selected ? '#EDF1F7' : colors.white,
                }}>
                <View
                  style={{
                    ...styles.categoryBlock,
                    backgroundColor: selected ? colors.white : item?.color,
                    borderColor: selected ? colors.blackLabel : colors.white,
                  }}>
                  <Text style={styles.fakeText}>{item.title}</Text>
                </View>
                <View row centered>
                  <Text
                    style={{
                      ...styles.categoryText,
                      color: selected ? colors.blackLabel : item?.color,
                    }}>
                    {item.title}
                  </Text>
                  {selected && (
                    <Icon
                      name="close"
                      size={17}
                      color={colors.blackLabel}
                      style={{position: 'absolute', right: -20}}
                    />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
};

export default ActivityEdit;
