import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
import { Animated, StatusBar, TouchableOpacity, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-crop-picker';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
  openLimitedPhotoLibraryPicker,
} from 'react-native-permissions';
import Modal from 'react-native-modal';

import { activitiesActions } from 'store/activities';
import { colors } from 'colors';
import { authActions } from 'store/auth';
import {
  View,
  Text,
  ItemCategory,
  Button,
  UserBlock,
  SubscribeButton,
  ActivityHeader,
} from 'components';
import { storage } from 'services/storage';
import { LocalizationContext } from 'services';

import styles from './styles';
import { routeNames } from 'enums';
import moment from 'moment';
import axios from 'axios';
import { API_URL } from 'constants';
import { DefaultBackDrop } from 'components/BackDrop';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { mamaAxios } from 'services/api';

const ActivityEdit = ({ navigation, route }) => {
  const [categoryTitle, setCategoryTitle] = useState('');
  const insets = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;
  const dispatch = useDispatch();
  const AnimatedIcon = Animated.createAnimatedComponent(Icon);
  const AnimatedIconIonicons = Animated.createAnimatedComponent(IconIonicons);
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);
  const { translations, appLanguage } = useContext(LocalizationContext);
  // const [editModa, setEditMode] = useState(false);
  const { activities_categories, loading, subscribeActivityLoading } =
    useSelector(state => state.activities);
  const [currentPhoto, setCurrentPhoto] = useState([]);
  const [currentCategories, setCurrentCategories] = useState([]);
  const snapPoints = useMemo(() => ['25%', '70%'], []);
  const bottomSheetRef = useRef();
  const { user } = useSelector(state => state.user);
  const { token } = useSelector(state => state.auth);
  const [deleteActivityModal, setDeleteActivityModal] = useState(false);
  const [activity, setActivity] = useState(route.params.activity || {});

  const fetchData = () => {
    axios({
      method: 'post',
      url: `${API_URL}/activities/get-activity`,
      data: { activity_id: route.params.activity.id },
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

  const activityUpdate = () => {
    mamaAxios.post(`${API_URL}/activities/activity-update`, activity).then(response => console.log(response.data))
  }

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
    dispatch(activitiesActions.getMyActivities({ activity_id: activity.id }));
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
    setActivity(prevState => ({ ...prevState, [key]: value }));
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

  const openCamera = async index => {
    let galleryPerm = null;

    if (Platform.OS === 'ios') {
      galleryPerm = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
    } else if (Platform.OS === 'android') {
      galleryPerm = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
    }

    switch (galleryPerm) {
      case RESULTS.GRANTED: {
        const result = await ImagePicker.openPicker({
          mediaType: 'photo',
          includeBase64: false,
          compressImageQuality: 0.5,
          maxFiles: 4,
          multiple: true,
        });
        setCurrentPhoto(result);
        break;
      }
      case RESULTS.BLOCKED:
        Alert.alert('Permission blocked', 'Please allow access if you want', [
          {
            text: 'Go To Settings',
            onPress: () => openSettings(),
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]);
        break;
      case RESULTS.LIMITED:
        openLimitedPhotoLibraryPicker();
        break;
      default:
        if (Platform.OS === 'ios') {
          request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        } else if (Platform.OS === 'android') {
          request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
        }
        break;
    }
  };


  const deletePost = () => {
    mamaAxios.post(`${API_URL}/activities/delete-activity`, { id: activity.id })
      .then((response) => {

        setDeleteActivityModal(false);
        navigation.navigate(routeNames.activities, {
          user_id: user.id,
          username: user.username,
        })
      })
  }

  console.log(currentPhoto)

  return (
    <View flex style={{ backgroundColor: colors.white }}>
      <Modal isVisible={deleteActivityModal} style={{ margin: 0 }}>
        <View flex style={{ justifyContent: 'flex-end', paddingBottom: insets.bottom || 16, paddingHorizontal: 16 }}>
          <TouchableOpacity style={{ ...styles.modalControlButton, marginBottom: 10 }} onPress={deletePost}>
            <Text medium size={16} color={colors.errorColor}>{translations.delete}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ ...styles.modalControlButton }} onPress={() => setDeleteActivityModal(false)}>
            <Text medium size={16} color={colors.mainBlue}>{translations.cancel}</Text>
          </TouchableOpacity>
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
              style={{ color: headerButtonColor }}
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
          {activity.user.id === user.id &&
            <AnimatedTouchableOpacity
              onPress={openCamera}
              style={{
                ...styles.secondHeaderBtn,
                backgroundColor: headerButtonBackgroundColor,
              }}>
              <AnimatedIconIonicons
                name={'images-outline'}
                size={24}
                style={{ color: headerButtonColor }}
              />
            </AnimatedTouchableOpacity>}
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
        <ActivityHeader fetchData={fetchData} navigation={navigation} activity={activity} userId={user.id} translations={translations} />
        <View style={{ padding: 20 }}>
          <View row flex centered style={{ backgroundColor: '#f4f4f4', height: 40, borderRadius: 14, paddingHorizontal: 16, }}>
            <TextInput
              value={activity.title}
              maxLength={100}
              onChangeText={value => changeField('title', value)}
              placeholder={'dfsds'}
              style={{ flex: 1, marginRight: 10, fontSize: 16, fontWeight: '600' }} />
          </View>
          <View mTop={16} mBottom={16} row flex centered style={{ backgroundColor: '#f4f4f4', paddingTop: 8, paddingBottom: 16, borderRadius: 14, paddingHorizontal: 16, }}>
            <TextInput
              maxLength={500}
              multiline
              value={activity.description}
              onChangeText={value => changeField('description', value)}
              placeholder={translations.description}
              style={{ flex: 1, marginRight: 10, fontSize: 14, minHeight: 100, textAlignVertical: 'top' }} />
          </View>
          {/* <TextInput
            multiline
            maxLength={250}
            style={{ minHeight: 100, fontSize: 15 }}
            value={activity.description}
            onChangeText={value => changeField('description', value)}
            placeholder={translations.description}
          /> */}
          {/* {activity.description ? (
            <Text size={16} style={{fontWeight: '500'}} color={'#afafaf'}>
              {activity.description}
            </Text>
          ) : null} */}
          {/* <View mTop={16} row>
            <Text size={16} style={{ fontWeight: '500' }} color={'#afafaf'}>
              Хочу выполнить это с{' '}
            </Text>
            <Text size={16} medium>
              {returnPartner(activity?.partner).toUpperCase()}
            </Text>
          </View> */}
          <View style={styles.block}>
            <View row centered sBetween>
              <Text size={18} style={{ fontWeight: '600' }}>
                {translations.categories}
              </Text>
              <TouchableOpacity
                onPress={() => bottomSheetRef.current.present()}>
                <Text color={colors.mainBlue} style={{ fontWeight: '600' }}>
                  {translations.add}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
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
            <Text size={18} style={{ fontWeight: '600' }} mBottom={8}>
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
                  containerStyle={{ marginBottom: 8 }}
                />
              ))
            ) : (
              <View>
                <Text size={16} style={{ fontWeight: '500' }} color={'#afafaf'}>
                  Пока что нету участников, стань первым
                </Text>
              </View>
            )}
          </View>
          <SubscribeButton
            loading={subscribeActivityLoading}
            onPress={() =>
              user.id === activity.user.id
                ? activityUpdate() :
                subscribeControl(
                  { user_id: user.id, activity_id: activity.id },
                  activity.subscribe,
                  activity,
                )
            }
            textStyle={{ fontSize: 15 }}
            style={{ height: 36, marginTop: 20 }}
            subscribe={activity.subscribe}
            text={
              user.id === activity.user.id
                ? translations.edit
                : activity.subscribe
                  ? translations.following
                  : translations.follow
            }
          />
          <TouchableOpacity style={styles.deleteButton} onPress={() => setDeleteActivityModal(true)}>
            <Text medium color={colors.errorColor}>{translations.delete}</Text>
          </TouchableOpacity>
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
          style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
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
                      style={{ position: 'absolute', right: -20 }}
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
