// import React, { useContext, useEffect, useState, useRef, useMemo } from 'react';
// import { Animated, StatusBar, TouchableOpacity, TextInput, Image, FlatList, Platform, ScrollView } from 'react-native';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useSelector, useDispatch } from 'react-redux';
// import Icon from 'react-native-vector-icons/FontAwesome';
// import IconIonicons from 'react-native-vector-icons/Ionicons';
// import ImagePicker from 'react-native-image-crop-picker';
// import {
//   request,
//   check,
//   PERMISSIONS,
//   RESULTS,
//   openSettings,
//   openLimitedPhotoLibraryPicker,
// } from 'react-native-permissions';
// import Modal from 'react-native-modal';

// import { activitiesActions } from 'store/activities';
// import { colors } from 'colors';
// import { authActions } from 'store/auth';
// import {
//   View,
//   Text,
//   ItemCategory,
//   Button,
//   UserBlock,
//   SubscribeButton,
//   ActivityHeader,
//   CustomSafeAreaView,
//   SearchInput,
//   SearchPlaces,
// } from 'components';
// import { storage } from 'services/storage';
// import { LocalizationContext } from 'services';

// import styles from './styles';
// import { routeNames } from 'enums';
// import moment from 'moment';
// import axios from 'axios';
// import { API_URL } from 'constants';
// import { DefaultBackDrop } from 'components/BackDrop';
// import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';
// import { mamaAxios } from 'services/api';
// import { GOOGLE_KEY } from 'constants';

// const ActivityEdit = ({ navigation, route }) => {
//   const [categoryTitle, setCategoryTitle] = useState('');
//   const insets = useSafeAreaInsets();
//   const scrollY = useRef(new Animated.Value(0)).current;
//   const dispatch = useDispatch();
//   const AnimatedIcon = Animated.createAnimatedComponent(Icon);
//   const AnimatedIconIonicons = Animated.createAnimatedComponent(IconIonicons);
//   const AnimatedTouchableOpacity =
//     Animated.createAnimatedComponent(TouchableOpacity);
//   const { translations, appLanguage } = useContext(LocalizationContext);
//   const { activities_categories, loading, subscribeActivityLoading } =
//     useSelector(state => state.activities);
//   const [currentCategories, setCurrentCategories] = useState([]);
//   const snapPoints = useMemo(() => ['25%', '70%'], []);
//   const bottomSheetRef = useRef();
//   const { user } = useSelector(state => state.user);
//   const { token } = useSelector(state => state.auth);
//   const [deleteActivityModal, setDeleteActivityModal] = useState(false);
//   const [activity, setActivity] = useState(route.params.activity || {});
//   const [updateActivityLoading, setUpdateActivityLoading] = useState(false);
//   const [updateModalVisible, setUpdateModalVisible] = useState(false);
//   const [locationHideModal, setLocationHideModal] = useState(false);
//   const [categoriesModalVisible, setCategoriesModalVisible] = useState(false)
//   const initialErrors = { title: false, description: false, categories: false, location: false };
//   const [errors, setErrors] = useState(initialErrors);


//   const fetchData = () => {
//     axios({
//       method: 'post',
//       url: `${API_URL}/activities/get-activity`,
//       data: { activity_id: route.params.activity.id },
//       headers: {
//         'accept-language': appLanguage,
//         Authorization: token,
//       },
//     })
//       .then(response => {
//         setActivity(response.data);
//       })
//       .catch(err => {
//         console.log('error', err.response.data);
//       });
//   };

//   console.log(activity.lat)
//   const activityUpdate = () => {
//     setUpdateActivityLoading(true);
//     let { title, description, id, activities_images, lat, lng } = activity;

//     let _errors = {};

//     if (title.length < 6) {
//       _errors.title = true;
//     }

//     if (description.length < 6) {
//       _errors.description = true;
//     }

//     if (!currentCategories.length) {
//       _errors.categories = true;
//     }

//     if (!lat && !lng) {
//       _errors.location = true;
//     }

//     if (Object.keys(_errors).length) {
//       setErrors(_errors);
//       setUpdateActivityLoading(false);
//       return;
//     }

//     let data = new FormData();

//     if (activities_images.length >= 1) {
//       activities_images.filter(el => !el?.createdAt).map(photo =>
//         data.append('image', {
//           uri:
//             Platform.OS === 'android'
//               ? photo.url
//               : photo.url?.replace('file://', ''),
//           name: 'image.jpg',
//           type: 'image/jpeg',
//         }),
//       );
//     }

//     if (currentCategories?.length) {
//       currentCategories.map(el => data.append('categories_ids', el));
//     }

//     data.append('title', title);
//     data.append('id', id);

//     data.append('description', description);


//     if (lat && lng) {
//       data.append('lat', lat);
//       data.append('lng', lng);
//     }

//     mamaAxios.post(`${API_URL}/activities/activity-update`, data, {
//       headers: {
//         'Content-Type': 'multipart/form-data'
//       }
//     }
//     )
//       .then(() => { setUpdateActivityLoading(false); setUpdateModalVisible(true) })
//       .catch(() => setUpdateActivityLoading(false))
//   }

//   useEffect(() => {
//     fetchData();
//     StatusBar.setHidden(true);
//   }, []);

//   useEffect(() => {
//     let data = {};

//     if (categoryTitle.length) {
//       data.title = categoryTitle;
//     }

//     dispatch(activitiesActions.getActivitiesCategories(data));
//   }, [appLanguage, categoryTitle]);

//   useEffect(() => {
//     if (activity?.activities_categories) {
//       setCurrentCategories(activity.activities_categories.map(el => el.id));
//     }
//   }, [activity]);

//   let inputRageHeader = activity?.activities_images.length
//     ? [0, 100, 220, 340]
//     : [0, 20, 30, 60];

//   let inputRageHeaderButton = activity?.activities_images.length
//     ? [0, 100, 340]
//     : [0, 30, 60];

//   const headerBackgroundColor = scrollY.interpolate({
//     inputRange: inputRageHeader,
//     outputRange: ['transparent', 'transparent', 'transparent', 'white'],
//     extrapolate: 'clamp',
//   });

//   const headerBorderColor = scrollY.interpolate({
//     inputRange: inputRageHeader,
//     outputRange: ['transparent', 'transparent', 'transparent', '#dddcdc'],
//     extrapolate: 'clamp',
//   });

//   const headerButtonBackgroundColor = scrollY.interpolate({
//     inputRange: inputRageHeaderButton,
//     outputRange: ['#0000005c', '#0000005c', 'transparent'],
//     extrapolate: 'clamp',
//   });

//   const headerButtonColor = scrollY.interpolate({
//     inputRange: inputRageHeader,
//     outputRange: ['white', 'white', 'white', colors.mainBlue],
//     extrapolate: 'clamp',
//   });

//   const headeractivitynameColor = scrollY.interpolate({
//     inputRange: inputRageHeader,
//     outputRange: ['transparent', 'transparent', 'transparent', 'black'],
//     extrapolate: 'clamp',
//   });

//   const returnPartner = partner => {
//     if (partner === 0) {
//       return translations.a_man;
//     } else if (partner === 1) {
//       return translations.a_women;
//     } else if (partner === 2) {
//       return translations.by_the_company;
//     } else {
//       return translations.all_the_same;
//     }
//   };

//   const subscribeControl = (data, subscribe, item) => {
//     if (subscribe) {
//       dispatch(activitiesActions.unsubscribeActivity(data, fetchData));
//     } else {
//       dispatch(activitiesActions.subscribeActivitiy(data, item, fetchData));
//     }
//   };

//   const changeField = (key, value) => {
//     setActivity(prevState => ({ ...prevState, [key]: value }));
//   };

//   const changeSelected = id => {
//     let categories = [...currentCategories];

//     if (currentCategories.includes(id)) {
//       categories = currentCategories.filter(el => el !== id);
//     } else if (currentCategories.length < 3) {
//       categories.push(id);
//     } else {
//       return;
//     }

//     setCurrentCategories(categories);
//   };

//   const openCamera = async index => {
//     let galleryPerm = null;

//     if (Platform.OS === 'ios') {
//       galleryPerm = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
//     } else if (Platform.OS === 'android') {
//       galleryPerm = await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
//     }

//     switch (galleryPerm) {
//       case RESULTS.GRANTED: {
//         const result = await ImagePicker.openPicker({
//           mediaType: 'photo',
//           includeBase64: false,
//           compressImageQuality: 0.5,
//           maxFiles: 4,
//           multiple: true,
//         });

//         console.log(result)

//         changeField('activities_images', [...activity.activities_images, ...result.map((image, index) => ({ url: Platform.OS === 'ios' ? image.sourceURL : image.path, edit: true, id: `${moment()}${index}` }))])
//         break;
//       }
//       case RESULTS.BLOCKED:
//         Alert.alert('Permission blocked', 'Please allow access if you want', [
//           {
//             text: 'Go To Settings',
//             onPress: () => openSettings(),
//           },
//           {
//             text: 'Cancel',
//             style: 'cancel',
//           },
//         ]);
//         break;
//       case RESULTS.LIMITED:
//         openLimitedPhotoLibraryPicker();
//         break;
//       default:
//         if (Platform.OS === 'ios') {
//           request(PERMISSIONS.IOS.PHOTO_LIBRARY);
//         } else if (Platform.OS === 'android') {
//           request(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);
//         }
//         break;
//     }
//   };


//   const deletePost = () => {
//     mamaAxios.post(`${API_URL}/activities/delete-activity`, { id: activity.id })
//       .then((response) => {

//         setDeleteActivityModal(false);
//         navigation.navigate(routeNames.activities, {
//           user_id: user.id,
//           username: user.username,
//         })
//       })
//   }

//   const [currentPlace, setCurrentPlace] = useState(null);

//   useEffect(() => {
//     const { lat, lng } = activity;
//     if (lat, lng) {
//       axios({
//         method: 'get',
//         url: `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_KEY}&result_type=locality`,
//         headers: { 'Accept-Language': appLanguage === 'ua' ? 'uk' : appLanguage }
//       }).then(response => {
//         setCurrentPlace({ place: response.data.results[0].formatted_address, lat, lng })

//       })
//     }
//   }, [activity])


//   const selectPlace = (item) => {
//     setActivity(prevState => ({ ...prevState, lat: item.location.lat, lng: item.location.lng }));
//     setCurrentPlace(item);
//     setLocationHideModal(false)
//   }

//   console.log('fsdfsd', activity)

//   return (
//     <View flex style={{ backgroundColor: colors.white }}>
//       <Modal isVisible={updateModalVisible}>
//         <View style={{ backgroundColor: colors.white, padding: 16, borderRadius: 14, alignItems: 'center' }}>
//           <IconIonicons size={80} color={colors.mainBlue} name="checkmark-circle-outline" />
//           <Text size={18} mTop={8} medium>{translations.updateSuccessfully}</Text>
//           <Button style={{ height: 36 }} text={'OK'} onPress={() => setUpdateModalVisible(false)} />
//         </View>
//       </Modal>
//       <Modal isVisible={deleteActivityModal} style={{ margin: 0 }}>
//         <View flex style={{ justifyContent: 'flex-end', paddingBottom: insets.bottom || 16, paddingHorizontal: 16 }}>
//           <TouchableOpacity style={{ ...styles.modalControlButton, marginBottom: 10 }} onPress={deletePost}>
//             <Text medium size={16} color={colors.errorColor}>{translations.delete}</Text>
//           </TouchableOpacity>
//           <TouchableOpacity style={{ ...styles.modalControlButton }} onPress={() => setDeleteActivityModal(false)}>
//             <Text medium size={16} color={colors.mainBlue}>{translations.cancel}</Text>
//           </TouchableOpacity>
//         </View>
//       </Modal>
//       <Animated.View
//         style={{
//           ...styles.headerContainer,
//           backgroundColor: headerBackgroundColor,
//           paddingTop: insets.top,
//         }}>
//         <View style={styles.header}>
//           <AnimatedTouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={{
//               ...styles.btnBack,
//               backgroundColor: headerButtonBackgroundColor,
//             }}>
//             <AnimatedIcon
//               name="angle-left"
//               size={30}
//               style={{ color: headerButtonColor }}
//             />
//           </AnimatedTouchableOpacity>
//           <Animated.Text
//             style={{
//               color: headeractivitynameColor,
//               fontSize: 20,
//               fontWeight: '500',
//             }}>
//             {/* {activity.activityname.toLocaleLowerCase()} */}
//           </Animated.Text>
//           {activity.user.id === user.id &&
//             <AnimatedTouchableOpacity
//               onPress={openCamera}
//               style={{
//                 ...styles.secondHeaderBtn,
//                 backgroundColor: headerButtonBackgroundColor,
//               }}>
//               <AnimatedIconIonicons
//                 name={'images-outline'}
//                 size={24}
//                 style={{ color: headerButtonColor }}
//               />
//             </AnimatedTouchableOpacity>}
//         </View>
//         <Animated.View
//           style={{
//             width: '100%',
//             height: 0.5,
//             backgroundColor: headerBorderColor,
//           }}
//         />
//       </Animated.View>
//       <Animated.ScrollView
//         showsVerticalScrollIndicator={false}
//         bounces={false}
//         onScroll={Animated.event(
//           [
//             {
//               nativeEvent: { contentOffset: { y: scrollY } },
//             },
//           ],
//           { useNativeDriver: false },
//         )}>
//         <ActivityHeader changeData={(data) => changeField('activities_images', data)} fetchData={fetchData} navigation={navigation} activity={activity} userId={user.id} translations={translations} />
//         <View style={{ padding: 20 }}>
//           <Text size={16} mBottom={8} color={'grey'}>{translations.title}</Text>
//           <View row flex centered style={[{ backgroundColor: '#f4f4f4', height: 40, borderRadius: 14, paddingHorizontal: 16, }, errors.title ? { borderWidth: 1, borderColor: 'red' } : { borderWidth: 0 }]}>
//             {/* <Image source={{ uri: activity.activities_images[0]?.url }} style={{ height: 100, width: 100 }} /> */}
//             <TextInput
//               value={activity.title}
//               maxLength={100}
//               onChangeText={value => changeField('title', value)}
//               placeholder={'dfsds'}
//               style={{ flex: 1, marginRight: 10, fontSize: 16, fontWeight: '600' }} />
//           </View>
//           <Text mTop={16} size={16} mBottom={8} color={'grey'}>{translations.description}</Text>
//           <View mBottom={16} row flex centered style={[{ backgroundColor: '#f4f4f4', paddingTop: 8, paddingBottom: 16, borderRadius: 14, paddingHorizontal: 16, }, errors.description ? { borderWidth: 1, borderColor: 'red' } : { borderWidth: 0 }]}>
//             <TextInput
//               maxLength={500}
//               multiline
//               value={activity.description}
//               onChangeText={value => changeField('description', value)}
//               placeholder={translations.description}
//               style={[{ flex: 1, marginRight: 10, fontSize: 14, minHeight: 100, textAlignVertical: 'top' }]} />
//           </View>
//           <Text size={16} color={'grey'}>{translations.location}</Text>
//           <TouchableOpacity onPress={() => setLocationHideModal(true)} style={[{ marginTop: 8, marginBottom: 16, borderWidth: 1, borderColor: colors.lightGrey, borderRadius: 14, height: 40, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal: 16 }, errors.location && { borderWidth: 1, borderColor: 'red' }]}>
//             <Text style={{ flex: 1 }} color={currentPlace?.place ? 'black' : 'grey'} numberOfLines={1}>{currentPlace?.place ? currentPlace?.place : translations.location}</Text>
//             <IconIonicons name="location-outline" size={20} color={'grey'} />
//           </TouchableOpacity>
//           {/* <TextInput
//             multiline
//             maxLength={250}
//             style={{ minHeight: 100, fontSize: 15 }}
//             value={activity.description}
//             onChangeText={value => changeField('description', value)}
//             placeholder={translations.description}
//           /> */}
//           {/* {activity.description ? (
//             <Text size={16} style={{fontWeight: '500'}} color={'#afafaf'}>
//               {activity.description}
//             </Text>
//           ) : null} */}
//           {/* <View mTop={16} row>
//             <Text size={16} style={{ fontWeight: '500' }} color={'#afafaf'}>
//               Хочу выполнить это с{' '}
//             </Text>
//             <Text size={16} medium>
//               {returnPartner(activity?.partner).toUpperCase()}
//             </Text>
//           </View> */}

//           <SearchPlaces
//             // location={location}
//             // setLocation={setLocation}
//             placeholder={translations.enterCityName}
//             appLanguage={appLanguage}
//             translations={translations}
//             visible={locationHideModal}
//             selectPlace={selectPlace}
//             setVisible={setLocationHideModal}
//           />

//           <View style={styles.block}>
//             <View row centered sBetween>
//               <Text size={16} color={'grey'}>
//                 {translations.categories}
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setCategoriesModalVisible(true)}>
//                 <Text color={colors.mainBlue} style={{ fontWeight: '600' }}>
//                   {translations.add}
//                 </Text>
//               </TouchableOpacity>
//             </View>
//             <View
//               style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 8 }}>
//               {currentCategories.length ? (
//                 currentCategories.map((el, index) => {
//                   let item = activities_categories[el - 1];
//                   return (
//                     <ItemCategory
//                       key={index}
//                       item={item}
//                       changeSelected={changeSelected}
//                     />
//                   );
//                 })
//               ) : (
//                 <View style={styles.messageAddCategories}>
//                   <Text  color={errors.categories ? 'red' : "#afafaf"}>
//                     {errors.categories ? translations.mustHaveAtLeastOneCategory : translations.add_categories_maximum}
//                   </Text>
//                 </View>
//               )}
//             </View>
//           </View>
//           <View mTop={16}>
//             <Text size={18} style={{ fontWeight: '600' }} mBottom={8}>
//               {translations.followers}{' '}
//               <Text size={16} color={colors.grey}>
//                 ({activity.subscribers.length})
//               </Text>
//             </Text>
//             {activity.subscribers.length ? (
//               activity.subscribers.map((subscriber, index) => (
//                 <UserBlock
//                   navigation={navigation}
//                   user={subscriber}
//                   key={index}
//                   containerStyle={{ marginBottom: 8 }}
//                 />
//               ))
//             ) : (
//               <View>
//                 <Text medium color={'#afafaf'}>
//                  {translations.noMembers}
//                 </Text>
//               </View>
//             )}
//           </View>
//           <SubscribeButton
//             loading={updateActivityLoading}
//             onPress={() =>
//               user.id === activity.user.id
//                 ? activityUpdate() :
//                 subscribeControl(
//                   { user_id: user.id, activity_id: activity.id },
//                   activity.subscribe,
//                   activity,
//                 )
//             }
//             textStyle={{ fontSize: 15 }}
//             disabled={updateActivityLoading}
//             style={{ height: 36, marginTop: 20 }}
//             subscribe={activity.subscribe}
//             text={
//               user.id === activity.user.id
//                 ? translations.edit
//                 : activity.subscribe
//                   ? translations.following
//                   : translations.follow
//             }
//           />
//           <TouchableOpacity style={styles.deleteButton} onPress={() => setDeleteActivityModal(true)}>
//             <Text medium color={colors.errorColor}>{translations.delete}</Text>
//           </TouchableOpacity>
//           {/* <Button
//             onPress={() =>
//               subscribeControl(
//                 {user_id: user.id, activity_id: activity.id},
//                 activity.subscribe,
//                 activity,
//               )
//             }
//             loading={subscribeActivityLoading}
//             text={!activity.subscribe ? 'Подписаться' : 'Отписаться'}
//             style={{height: 40}}
//           /> */}
//         </View>
//       </Animated.ScrollView>
//       <Modal
//         isVisible={categoriesModalVisible}
//         style={{ backgroundColor: colors.white, margin: 0 }}
//         backdropColor={'transparent'}
//       >
//         <CustomSafeAreaView>
//           <View style={styles.sheet}>
//             <Text size={20}>{translations.select_categories}</Text>
//             <View style={{ width: '100%', height: 40 }} row centered mTop={16}>
//               <SearchInput
//                 value={categoryTitle}
//                 placeholder={translations.category_search}
//                 style={styles.categorySearch}
//                 onChangeText={setCategoryTitle}
//               />
//               <TouchableOpacity onPress={() => setCategoriesModalVisible(false)} style={{ marginLeft: 16 }}>
//                 <Text color={colors.mainBlue} medium>{currentCategories.length ? translations.save : translations.cancel}</Text>
//               </TouchableOpacity>
//             </View>
//           </View>
//         </CustomSafeAreaView>
//         <ScrollView
//           style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
//           {activities_categories.map((item, index) => {
//             let selected = currentCategories.includes(item.id);
//             return (
//               <TouchableOpacity
//                 disabled={
//                   currentCategories.length >= 3 &&
//                   !currentCategories.includes(item.id)
//                 }
//                 onPress={() => changeSelected(item.id)}
//                 key={index}
//                 style={{
//                   ...styles.categoryContainer,
//                   borderColor: selected ? '#EDF1F7' : colors.white,
//                 }}>
//                 <View
//                   style={{
//                     ...styles.categoryBlock,
//                     backgroundColor: selected ? colors.white : item?.color,
//                     borderColor: selected ? colors.blackLabel : colors.white,
//                   }}>
//                   <Text style={styles.fakeText}>{item.title}</Text>
//                 </View>
//                 <View row centered>
//                   <Text
//                     style={{
//                       ...styles.categoryText,
//                       color: selected ? colors.blackLabel : item?.color,
//                     }}>
//                     {item.title}
//                   </Text>
//                   {selected && (
//                     <IconIonicons
//                       name="close"
//                       size={17}
//                       color={colors.blackLabel}
//                       style={{ position: 'absolute', right: -20 }}
//                     />
//                   )}
//                 </View>
//               </TouchableOpacity>
//             );
//           })}
//         </ScrollView>
//       </Modal>
//     </View>
//   );
// };

// export default ActivityEdit;

import axios from 'axios';
import { API_URL } from 'constants';
import { routeNames } from 'enums';
import { ActivityOperation } from 'layouts';
import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { LocalizationContext } from 'services';

const ActivityEdit = ({ route, navigation }) => {
  const { translations, appLanguage } = useContext(LocalizationContext);
  const [activity, setActivity] = useState(route.params.activity || {});
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    fetchData();

  }, [])
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


  return (
    <ActivityOperation
      popUpText={translations.updateSuccessfully}
      navigation={navigation}
      fetchData={fetchData}
      updateList={route.params.updateList}
      showDeletePost
      url={'/activities/activity-update'}
      mainButton={translations.edit}
      activity={activity}
      showUser
      setActivity={setActivity}
    />
  )
}

export default ActivityEdit;