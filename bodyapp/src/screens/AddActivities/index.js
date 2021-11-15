import React, {useState, useRef, useMemo, useEffect} from 'react';
import {
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  ScrollView,
  Platform,
  Alert,
  ImageBackground,
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {useSelector, useDispatch} from 'react-redux';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {
  request,
  check,
  PERMISSIONS,
  RESULTS,
  openSettings,
  openLimitedPhotoLibraryPicker,
} from 'react-native-permissions';
import axios from 'axios';
import {API_URL} from 'constants';
import {colors} from 'colors';
import {authActions} from 'store/auth';
import {View, Text, Button, CheckBox} from 'components';
import {images} from 'images';
import {storage} from 'services/storage';
import {activitiesActions} from 'store/activities';
import {routeNames} from 'enums';
import {DefaultBackDrop} from 'components/BackDrop';

import styles from './styles';

const AddActivities = props => {
  const {user} = useSelector(state => state.user);
  const {activities_categories} = useSelector(state => state.activities);
  const [parsedCategories, parseCategories] = useState(activities_categories);
  const [currentPhoto, setCurrentPhoto] = useState(null);
  const {token} = useSelector(state => state.auth);

  const [title, setTitle] = useState('');
  const dispatch = useDispatch();
  const bottomSheetRef = useRef();

  useEffect(() => {
    dispatch(activitiesActions.getActivitiesCategories());
    parseCategories(activities_categories);
  }, []);

  // variables
  const snapPoints = useMemo(() => ['25%', '70%'], []);

  const [description, setDescription] = useState('');

  const createNewActivities = () => {
    const data = new FormData();

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

    data.append('title', title);
    data.append('description', description);
    data.append('user_id', user.id);
    currentCategories.map(item => data.append('categories_ids', item.id));

    axios({
      method: 'post',
      url: `${API_URL}/activities/create-new-activities`,
      data,
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token,
      },
    })
      .then(response => {
        // setTitle('');
        // setDescription('');
        // setCurrentCategories([]);
        props.navigation.navigate(routeNames.home, {tab: false});
      })
      .catch(err => {
        console.log('Error', err.response.data);
      });
  };

  const [currentCategories, setCurrentCategories] = useState([]);

  const changeSelected = item => {
    let categories = [...currentCategories];

    if (currentCategories.includes(item)) {
      categories = currentCategories.filter(el => el.id !== item.id);
    } else if (currentCategories.length < 3) {
      categories.push(item);
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

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: colors.white,
        paddingHorizontal: 20,
      }}>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={DefaultBackDrop}>
        <View
          style={{
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            paddingBottom: 16,
            borderColor: colors.lightGrey,
          }}>
          <Text size={20}>Выберете категорию</Text>
          <TextInput
            placeholder={'Поиск категории'}
            style={{
              backgroundColor: '#f4f4f4',
              marginTop: 8,
              borderRadius: 14,
              fontSize: 18,
              paddingHorizontal: 16,
              paddingTop: 8,
              paddingBottom: 8,
            }}
          />
        </View>
        <BottomSheetScrollView style={styles.contentContainer}>
          {activities_categories.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={{
                height: 40,
                borderBottomWidth: 0.5,
                borderColor: colors.lightGrey,
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
              onPress={() => changeSelected(item)}>
              <Text size={16}>{item.ru}</Text>
              <CheckBox
                selected={currentCategories.includes(item)}
                changeSelect={() => changeSelected(item)}
              />
            </TouchableOpacity>
          ))}
        </BottomSheetScrollView>
      </BottomSheetModal>
      <View>
        <SafeAreaView />
        <Text size={20}>Создать новое обьявления</Text>
        <TextInput
          multiline
          value={title}
          onChangeText={setTitle}
          placeholder="Заголовок"
          style={{
            backgroundColor: '#f4f4f4',
            marginTop: 8,
            borderRadius: 14,
            fontSize: 18,
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 16,
          }}
        />
        <View row sBetween mTop={16} centered>
          <Text size={18}>Описание</Text>
          <Text>{description.length}/250</Text>
        </View>
        <TextInput
          multiline
          maxLength={250}
          value={description}
          placeholder="Текст"
          onChangeText={setDescription}
          style={{
            backgroundColor: '#f4f4f4',
            minHeight: 160,
            fontSize: 18,
            borderRadius: 14,
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 16,
            marginTop: 8,
          }}
        />
        <View mTop={16} row centered sBetween>
          <Text size={18}>Категории</Text>
          <TouchableOpacity onPress={() => bottomSheetRef.current.present()}>
            <Text>Добавить</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: 8}}>
          {currentCategories.length ? (
            currentCategories.map((item, index) => (
              <TouchableOpacity
                onPress={() => changeSelected(item)}
                key={index}
                style={{
                  height: 36,
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  marginRight: 8,
                  marginBottom: 8,
                  backgroundColor: item.color,
                }}>
                <Text size={16} color={colors.white}>
                  {item.ru}
                </Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={{height: 44}}>
              <Text>Добавить категории максимально 3</Text>
            </View>
          )}
        </View>
        {currentPhoto ? (
          <ImageBackground
            source={{uri: currentPhoto.path}}
            imageStyle={{borderRadius: 14}}
            style={{
              width: '100%',
              alignItems: 'flex-end',
              borderRadius: 14,
              justifyContent: 'flex-end',
              height: 160,
            }}>
            <TouchableOpacity
              onPress={() => setCurrentPhoto(null)}
              style={{
                backgroundColor: 'blue',
                width: 50,
                height: 50,
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text>fsdfsd</Text>
            </TouchableOpacity>
          </ImageBackground>
        ) : (
          <TouchableOpacity
            onPress={openCamera}
            style={{
              width: '100%',
              borderRadius: 14,
              height: 160,
              backgroundColor: 'grey',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>Загрузить фотографию</Text>
          </TouchableOpacity>
        )}
      </View>
      <Button text={'Опубликовать'} onPress={createNewActivities} />
    </ScrollView>
  );
};

export default AddActivities;
