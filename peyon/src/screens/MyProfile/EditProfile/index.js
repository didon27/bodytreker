import {colors} from 'colors';
import {
  Button,
  CustomSafeAreaView,
  TextInput,
  View,
  Text,
  Avatar,
  CheckBox,
} from 'components';
import {images} from 'images';
import React, {Fragment, useContext, useEffect, useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
  Animated,
  KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {useSelector, useDispatch} from 'react-redux';
import {LocalizationContext} from 'services';
import {userActions} from 'store/user';
import styles from './styles';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
  openLimitedPhotoLibraryPicker,
} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import axios from 'axios';
import {API_URL} from 'constants';
import {API} from 'constants';
import {routeNames} from 'enums';

import DropDownPicker from 'react-native-dropdown-picker';

const EditProfile = props => {
  const {translations} = useContext(LocalizationContext);
  const [updateUserLoading, setUpdateUserLoading] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const {token} = useSelector(state => state.auth);
  const scrollY = useRef(new Animated.Value(0)).current;
  const [user, setUser] = useState(useSelector(state => state.user.user));
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    {label: 'Не женат', value: 1},
    {label: 'Встречаюсь', value: 2},
    {label: 'Помолвлен', value: 3},
    {label: 'Женат', value: 4},
    {label: 'Влюблен', value: 5},
    {label: 'Все сложно', value: 6},
    {label: 'В активном поиске', value: 7},
  ]);

  useEffect(() => {
    if (user.gender === 1) {
      setItems([
        {label: translations.unmarried, value: 1},
        {label: translations.dating, value: 2},
        {label: 'Помолвлен', value: 3},
        {label: 'Женат', value: 4},
        {label: 'Влюблен', value: 5},
        {label: 'Все сложно', value: 6},
        {label: 'В активном поиске', value: 7},
      ]);
    } else {
      setItems([
        {label: 'Не замужем', value: 1},
        {label: 'Встречаюсь', value: 2},
        {label: 'Помолвлена', value: 3},
        {label: 'Замужем', value: 4},
        {label: 'Влюблена', value: 5},
        {label: 'Все сложно', value: 6},
        {label: 'В активном поиске', value: 7},
      ]);
    }
  }, [user.gender]);

  const changeUserField = (key, value) => {
    setUser(prevState => ({...prevState, [key]: value}));
  };

  const updateUser = () => {
    const data = new FormData();
    setUpdateUserLoading(true);

    if (currentPhoto) {
      data.append('image', {
        uri:
          Platform.OS === 'android'
            ? currentPhoto.path
            : currentPhoto.sourceURL?.replace('file://', ''),
        name: 'image.jpg',
        type: 'image/jpeg',
      });
    }

    data.append('id', user.id);
    data.append('status', user.status);
    data.append('last_name', user.last_name);
    data.append('first_name', user.first_name);
    data.append('username', user.username);
    data.append('gender', user.gender);
    data.append('description', user.description);

    axios({
      method: 'post',
      url: `${API_URL}/user/update-user`,
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token,
      },
    })
      .then(response => {
        console.log(response.data);
        setUpdateUserLoading(false);
        setCurrentPhoto(null);
        dispatch(userActions.updateUserSuccess(response.data));
        props.navigation.navigate(routeNames.myProfile);
      })
      .catch(err => {
        setUpdateUserLoading(false);
        console.log('error', err.response.data);
      });
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
          multiple: false,
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

  const genderButton = (title, value) => {
    return (
      <TouchableOpacity
        style={{flexDirection: 'row'}}
        onPress={() => changeUserField('gender', value)}>
        <CheckBox
          selected={user.gender === value}
          changeSelect={() => changeUserField('gender', value)}
        />
        <Text size={16} mLeft={8}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  const headerBorderColor = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: ['transparent', '#dddcdc'],
    extrapolate: 'clamp',
  });

  return (
    <KeyboardAvoidingView behavior={'height'} style={{flex: 1}}>
    <Fragment>
      <CustomSafeAreaView style={{backgroundColor: colors.white}}>
        <View
          row
          centered
          sBetween
          style={{paddingHorizontal: 16, paddingBottom: 16}}>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <Icon name="angle-left" size={30} color={'#585858'} />
          </TouchableOpacity>
          <Button
            text={translations.save}
            loading={updateUserLoading}
            textStyle={{fontSize: 14}}
            onPress={updateUser}
            style={{
              marginTop: 0,
              height: 31,
              width: null,
              paddingHorizontal: 12,
            }}
          />
        </View>
        <Animated.View
          style={{
            width: '100%',
            height: 0.5,
            backgroundColor: headerBorderColor,
          }}
        />
      </CustomSafeAreaView>
      <Animated.ScrollView
        onScroll={Animated.event(
          [
            {
              nativeEvent: {contentOffset: {y: scrollY}},
            },
          ],
          {useNativeDriver: false},
        )}
        style={{backgroundColor: colors.white}}
        bounces={false}
        contentContainerStyle={{paddingBottom: 40}}
        showsVerticalScrollIndicator={false}>
        <View style={{width: '100%', alignItems: 'center', marginVertical: 10}}>
          <View>
            <Avatar
              edit
              style={{width: 110, height: 110, borderRadius: 55, zIndex: 0}}
              letterStyle={{fontSize: 40}}
              user={{
                first_name: user.first_name,
                avatar: currentPhoto
                  ? Platform.OS === 'ios'
                    ? currentPhoto.path
                    : currentPhoto
                  : user.avatar
                  ? API + '/images/' + user.avatar
                  : null,
              }}
            />
            <TouchableOpacity style={styles.camera} onPress={openCamera}>
              <Icon name={'camera'} size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{paddingHorizontal: 16}}>
          <TextInput
            label={translations.first_name}
            value={user.first_name}
            containerStyle={styles.input}
            labelStyle={{color: 'grey'}}
            onChangeText={value => changeUserField('first_name', value)}
          />
          <TextInput
            label={translations.last_name}
            value={user.last_name}
            containerStyle={styles.input}
            labelStyle={{color: 'grey'}}
            onChangeText={value => changeUserField('last_name', value)}
          />
          <TextInput
            label={'Username'}
            value={user.username}
            containerStyle={styles.input}
            labelStyle={{color: 'grey'}}
            onChangeText={value => changeUserField('username', value)}
          />
          <Text mLeft={8} size={16} color={'grey'} mTop={16}>
            Пол
          </Text>
          <View
            row
            style={{
              borderBottomWidth: 0.5,
              borderColor: colors.lightGrey,
              paddingVertical: 16,
              paddingLeft: 8,
              justifyContent: 'space-around',
            }}>
            {genderButton('Мужчина', 1)}
            {genderButton('Женщина', 2)}
            {genderButton('Другое', 3)}
          </View>
          <Text mLeft={8} size={16} color={'grey'} mTop={16}>
            Симейное положение
          </Text>
          <DropDownPicker
            open={open}
            placeholder="Ничего не выбрано"
            placeholderStyle={{color: 'grey'}}
            value={user.status}
            items={items}
            setOpen={setOpen}
            setValue={value => changeUserField('status', value())}
            setItems={setItems}
            // containerStyle={{
            //   paddingHorizontal: 8
            // }}
            style={{
              borderBottomWidth: 1,
              borderTopWidth: 0,
              borderRadius: 0,
              borderLeftWidth: 0,
              borderRightWidth: 0,
              borderColor: colors.lightGrey,
            }}
            textStyle={{
              fontSize: 18,
            }}
            dropDownContainerStyle={{
              borderColor: colors.lightGrey,
              borderRadius: 0,
            }}
            listMode="SCROLLVIEW"
            dropDownDirection="BOTTOM"
            bottomOffset={200}
          />
          <TextInput
            label={translations.description}
            placeholder={translations.description}
            value={user.description}
            containerStyle={{...styles.input, height: 170}}
            textInputStyle={{height: 130, paddingTop: 0}}
            labelStyle={{color: 'grey', marginBottom: 10}}
            multiline
            onChangeText={value => changeUserField('description', value)}
          />
        </View>
      </Animated.ScrollView>
    </Fragment>
    </KeyboardAvoidingView>
  );
};

export default EditProfile;
