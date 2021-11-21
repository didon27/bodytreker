import React, {useState, useRef, useMemo, useEffect, useContext} from 'react';
import {
  StatusBar,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
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
import {
  View,
  Text,
  Button,
  CheckBox,
  CustomSafeAreaView,
  ItemCategory,
} from 'components';
import {images} from 'images';
import {activitiesActions} from 'store/activities';
import {routeNames} from 'enums';
import {DefaultBackDrop} from 'components/BackDrop';

import styles from './styles';
import {LocalizationContext} from 'services';
import Icon from 'react-native-vector-icons/MaterialIcons';

const AddActivities = props => {
  const {appLanguage, translations} = useContext(LocalizationContext);
  const {user} = useSelector(state => state.user);
  const scrollY = useRef(new Animated.Value(0)).current;
  const {activities_categories, loading} = useSelector(
    state => state.activities,
  );
  const [currentPhoto, setCurrentPhoto] = useState([]);
  const {token} = useSelector(state => state.auth);

  const [title, setTitle] = useState('');
  const [partner, setPartner] = useState(null);
  const dispatch = useDispatch();
  const bottomSheetRef = useRef();

  useEffect(() => {
    dispatch(activitiesActions.getActivitiesCategories());
  }, [appLanguage]);

  // variables
  const snapPoints = useMemo(() => ['25%', '70%'], []);

  const [description, setDescription] = useState('');

  const createNewActivities = () => {
    const data = new FormData();

    if (currentPhoto.length > 1) {
      currentPhoto.map(photo =>
        data.append('image', {
          uri:
            Platform.OS === 'android'
              ? photo.path
              : photo.sourceURL?.replace('file://', ''),
          name: 'image.jpg',
          type: 'image/jpeg',
        }),
      );
    }

    if (partner) {
      data.append('partner', partner);
    }

    data.append('title', title);
    data.append('description', description);
    data.append('user_id', user.id);

    currentCategories.map(id => data.append('categories_ids', id));

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

  const returnPartnerCheckbox = (title, id) => {
    return (
      <TouchableOpacity
        style={styles.partnerItem}
        onPress={() => setPartner(id)}>
        <CheckBox
          selected={partner === id}
          changeSelect={() => setPartner(id)}
        />
        <Text size={16} mLeft={6}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };
  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: ['white', '#dddcdc'],
    extrapolate: 'clamp',
  });

  return (
    <View style={{backgroundColor: 'white', flex: 1}}>
      <CustomSafeAreaView>
        <View
          style={{paddingHorizontal: 20, paddingBottom: 20}}
          row
          centered
          sBetween>
          <Text size={20} style={{fontWeight: '600'}}>
            New post
          </Text>
          <Button
            onPress={createNewActivities}
            text={translations.publish}
            loading={loading}
            textStyle={{fontSize: 14}}
            style={{
              backgroundColor: colors.mainBlue,
              paddingHorizontal: 12,
              alignItems: 'center',
              justifyContent: 'center',
              height: 32,
              width: null,
              marginTop: 0,
              borderRadius: 8,
            }}
          />
        </View>
        <Animated.View
          style={{
            width: '100%',
            height: 0.5,
            backgroundColor: headerBackgroundColor,
          }}
        />
      </CustomSafeAreaView>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingBottom: 20,
          paddingTop: 10,
        }}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {contentOffset: {y: scrollY}},
            },
          ],
          {useNativeDriver: false},
        )}>
        <ScrollView
          horizontal
          contentContainerStyle={{paddingHorizontal: 20, paddingBottom: 20}}
          showsHorizontalScrollIndicator={false}>
          {currentPhoto.map((item, index) => (
            <ImageBackground
              key={index}
              source={{uri: item.path}}
              imageStyle={{borderRadius: 14}}
              style={{
                alignItems: 'flex-end',
                borderRadius: 14,
                justifyContent: 'flex-end',
                height: 90,
                width: 120,
                marginRight: 10,
              }}>
              <TouchableOpacity
                onPress={() =>
                  setCurrentPhoto(
                    currentPhoto.filter(el => el.path !== item.path),
                  )
                }
                style={{
                  backgroundColor: 'white',
                  shadowColor: '#000',
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,

                  elevation: 5,
                  width: 24,
                  height: 24,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon name="close" size={14} />
              </TouchableOpacity>
            </ImageBackground>
          ))}
          {currentPhoto.length < 4 && (
            <TouchableOpacity
              onPress={openCamera}
              style={{
                height: 90,
                width: 120,
                borderRadius: 14,
              }}>
              <View
                style={{
                  height: '100%',
                  borderRadius: 10,
                  width: '100%',
                  borderStyle: 'dashed',
                  // backgroundColor: '#f4f4f4',
                  borderWidth: 2,
                  borderColor: colors.lightGrey,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Icon
                  name={'add-photo-alternate'}
                  size={40}
                  color={colors.lightGrey}
                />
              </View>
            </TouchableOpacity>
          )}
        </ScrollView>
        <View style={{paddingHorizontal: 20}}>
          {/* {currentPhoto ? (
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
          )} */}
          <View style={styles.block}>
            <View row sBetween centered>
              <Text size={18} style={{fontWeight: '600'}}>
                Заголовок
              </Text>
              <Text>
                {title.length}
                <Text style={{color: 'grey'}}>/250</Text>
              </Text>
            </View>
            <TextInput
              multiline
              value={title}
              onChangeText={setTitle}
              placeholder="Заголовок"
              style={{
                backgroundColor: '#f4f4f4',
                marginTop: 8,
                borderRadius: 10,
                fontSize: 16,
                paddingHorizontal: 12,
                paddingTop: 12,
                paddingBottom: 12,
              }}
            />

            <View row sBetween centered mTop={16}>
              <Text size={18} style={{fontWeight: '600'}}>
                Описание
              </Text>
              <Text>
                {description.length}
                <Text style={{color: 'grey'}}>/250</Text>
              </Text>
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
                fontSize: 16,
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingTop: 10,
                paddingBottom: 10,
                marginTop: 8,
              }}
            />
          </View>
          <View style={styles.block} mTop={16}>
            <View row centered sBetween>
              <Text size={18} style={{fontWeight: '600'}}>
                Категории
              </Text>
              <TouchableOpacity
                onPress={() => bottomSheetRef.current.present()}>
                <Text color={colors.mainBlue} style={{fontWeight: '600'}}>
                  Добавить
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
                    // <TouchableOpacity
                    //   onPress={() => changeSelected(item.id)}
                    //   key={index}
                    //   style={{
                    //     marginRight: 8,
                    //     height: 32,
                    //     position: 'relative',
                    //     alignItems: 'center',
                    //     justifyContent: 'center',
                    //     paddingHorizontal: 10,
                    //     marginBottom: 8,
                    //   }}>
                    //   <View
                    //     style={{
                    //       opacity: 0.16,
                    //       position: 'absolute',
                    //       top: 0,
                    //       left: 0,
                    //       bottom: 0,
                    //       right: 0,
                    //       zIndex: -1,
                    //       borderRadius: 12,
                    //       backgroundColor: item.color,
                    //     }}
                    //   />
                    //   <View row centered>
                    //     <Text
                    //       style={{
                    //         fontWeight: '600',
                    //         color: item.color,
                    //         marginRight: 4,
                    //       }}>
                    //       {item.title}
                    //     </Text>
                    //     <Icon name="ios-close" size={16} color={item.color} />
                    //   </View>
                    // </TouchableOpacity>
                    // <TouchableOpacity
                    //   onPress={() => changeSelected(item)}
                    //   key={index}
                    //   style={{
                    //     height: 32,
                    //     borderRadius: 10,
                    //     justifyContent: 'center',
                    //     alignItems: 'center',
                    //     paddingHorizontal: 16,
                    //     marginRight: 8,
                    //     marginBottom: 8,
                    //     backgroundColor: item.color,
                    //   }}>
                    //   <Text size={16} color={colors.white}>
                    //     {item.title}
                    //   </Text>
                    // </TouchableOpacity>
                  );
                })
              ) : (
                <View
                  style={{
                    height: 44,
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                  }}>
                  <Text size={16} color="grey">
                    Добавить категории максимально 3
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.block} mTop={16}>
            <Text size={18} style={{fontWeight: '600'}} mBottom={6}>
              С кем бы вы хотели выполнить действие?
            </Text>
            {returnPartnerCheckbox('Мужчиной', 0)}
            {returnPartnerCheckbox('Женщиной', 1)}
            {returnPartnerCheckbox('Компанией', 2)}
            {returnPartnerCheckbox('Всеровно', 3)}
          </View>
        </View>
      </Animated.ScrollView>
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
              onPress={() => changeSelected(item.id)}>
              <Text size={16}>{item.title}</Text>
              <CheckBox
                selected={currentCategories.includes(item.id)}
                changeSelect={() => changeSelected(item.id)}
              />
            </TouchableOpacity>
          ))}
        </BottomSheetScrollView>
      </BottomSheetModal>
    </View>
  );
};

export default AddActivities;
