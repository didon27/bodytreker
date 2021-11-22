import React, {useState, useRef, useMemo, useEffect, useContext} from 'react';
import {
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
import Icon from 'react-native-vector-icons/MaterialIcons';
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
import {activitiesActions} from 'store/activities';
import {routeNames} from 'enums';
import {DefaultBackDrop} from 'components/BackDrop';
import {LocalizationContext} from 'services';

import styles from './styles';

const AddActivities = props => {
  const {appLanguage, translations} = useContext(LocalizationContext);
  const {createNewActivitiesError} = useSelector(state => state.activities);
  const {user} = useSelector(state => state.user);
  const scrollY = useRef(new Animated.Value(0)).current;
  const {activities_categories, loading} = useSelector(
    state => state.activities,
  );
  const [currentPhoto, setCurrentPhoto] = useState([]);
  const {token} = useSelector(state => state.auth);
  const [currentCategories, setCurrentCategories] = useState([]);
  const [title, setTitle] = useState('');
  const [categoryTitle, setCategoryTitle] = useState('');
  const [partner, setPartner] = useState(null);
  const dispatch = useDispatch();
  const bottomSheetRef = useRef();

  useEffect(() => {
    let data = {};

    if (categoryTitle.length > 3) {
      data.title = categoryTitle;
    }

    dispatch(activitiesActions.getActivitiesCategories(data));
  }, [appLanguage, categoryTitle]);

  useEffect(() => {
    if (createNewActivitiesError) {
      dispatch(activitiesActions.createNewActivitiesError(null));
    }
  }, [title, description]);

  // variables
  const snapPoints = useMemo(() => ['25%', '70%'], []);

  const [description, setDescription] = useState('');

  const createNewActivities = () => {
    const data = new FormData();

    if (title.length < 6) {
      dispatch(
        activitiesActions.createNewActivitiesError({
          title: translations.minimum_six_characters,
        }),
      );
      return;
    }

    if (description.length < 6) {
      dispatch(
        activitiesActions.createNewActivitiesError({
          description: translations.minimum_six_characters,
        }),
      );
      return;
    }

    dispatch(activitiesActions.createNewActivitiesError(null));

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

    if (currentCategories.length) {
      currentCategories.map(id => data.append('categories_ids', id));
    }

    data.append('title', title);
    data.append('description', description);
    data.append('user_id', user.id);

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
        props.navigation.navigate(routeNames.home);
      })
      .catch(err => {
        console.log('Error', err.response.data);
      });
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
            {translations.newActivities}
          </Text>
          <Button
            onPress={createNewActivities}
            text={translations.publish}
            loading={loading}
            textStyle={{fontSize: 14}}
            style={styles.publishBtn}
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
              style={styles.image}>
              <TouchableOpacity
                onPress={() =>
                  setCurrentPhoto(
                    currentPhoto.filter(el => el.path !== item.path),
                  )
                }
                style={styles.removeImage}>
                <Icon name="close" size={14} />
              </TouchableOpacity>
            </ImageBackground>
          ))}
          {currentPhoto.length < 4 && (
            <TouchableOpacity onPress={openCamera} style={styles.addPhotoBlock}>
              <View style={styles.addPhoto}>
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
          <View style={styles.block}>
            <View row sBetween centered>
              <Text size={18} style={{fontWeight: '600'}}>
                {translations.title}
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
              placeholder={translations.title}
              style={{
                ...styles.titleInput,
                borderColor: createNewActivitiesError?.title
                  ? colors.errorColor
                  : colors.white,
              }}
            />
            {/* {createNewActivitiesError?.title && (
              <Text color={colors.errorColor} style={{marginBottom: -18}}>
                {createNewActivitiesError.title}
              </Text>
            )} */}
            <View row sBetween centered mTop={16}>
              <Text size={18} style={{fontWeight: '600'}}>
                {translations.description}
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
              placeholder={translations.description}
              onChangeText={setDescription}
              style={{
                ...styles.descriptionInput,
                borderColor: createNewActivitiesError?.description
                  ? colors.errorColor
                  : colors.white,
              }}
            />
            {/* {createNewActivitiesError?.description && (
              <Text color={colors.errorColor} style={{marginBottom: -18}}>
                {createNewActivitiesError.description}
              </Text>
            )} */}
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
          <View style={styles.block} mTop={16}>
            <Text size={18} style={{fontWeight: '600'}} mBottom={6}>
              {translations.who_would_you_like}
            </Text>
            {returnPartnerCheckbox(translations.a_man, 0)}
            {returnPartnerCheckbox(translations.a_women, 1)}
            {returnPartnerCheckbox(translations.by_the_company, 2)}
            {returnPartnerCheckbox(translations.all_the_same, null)}
          </View>
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
                    backgroundColor: selected ? colors.white : item.color,
                    borderColor: selected ? colors.blackLabel : colors.white,
                  }}>
                  <Text style={styles.fakeText}>{item.title}</Text>
                </View>
                <View row centered>
                  <Text
                    style={{
                      ...styles.categoryText,
                      color: selected ? colors.blackLabel : item.color,
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

export default AddActivities;
