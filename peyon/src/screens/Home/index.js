import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useContext,
} from 'react';
import { StatusBar, TextInput, TouchableOpacity, Animated, TouchableWithoutFeedback, LogBox, FlatList, ActivityIndicator, PermissionsAndroid } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';

import { Shadow } from 'react-native-shadow-2';
import { activitiesActions } from 'store/activities';
import {
  View,
  Text,
  CustomSafeAreaView,
  CheckBox,
  ActivitiesCard,
} from 'components';
import { DefaultBackDrop } from 'components/BackDrop';
import { DEVICE_HEIGHT } from 'constants';
import { LocalizationContext } from 'services';
import { colors } from 'colors';

import styles from './styles';
import { FiltersActivities, SearchActivities } from 'layouts';
import { color } from 'react-native-reanimated';
import Geolocation from '@react-native-community/geolocation';
import { userActions } from 'store/user';


const Home = props => {
  const { appLanguage, translations } = useContext(LocalizationContext);
  const { user, userLocation} = useSelector(state => state.user);
  const [filters, setFilters] = useState({});
  const user_id = user.id;
  const [partner, setPartner] = useState(null);
  const [pageActivities, setPageActivities] = useState(0);
  const [pageSubscriptions, setPageSubscriptions] = useState(0);
  const [pageFriends, setPageFriends] = useState(0);
  const [tab, setTab] = useState('actual');
  const [search, setSearch] = useState('');
  const [hideSearch, setHideSearch] = useState(true);
  const [openMenu, setOpenMenu] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const tabs = [
    { title: translations.actual, key: 'actual' },
    { title: translations.friends, key: 'friends' },
    { title: translations.followings, key: 'followings' },
  ];

  const {
    activities,
    activities_categories,
    subscriptionActivities,
    activitiesLoading,
    friendsActivities,
    friendsActivitiesLoading,
    subscriptionActivitiesLoading,
    subscribeActivityLoading,
  } = useSelector(state => state.activities);

  const dispatch = useDispatch();

  let data = tab === 'actual' ? activities.activities : tab === 'followings' ? subscriptionActivities.activities : friendsActivities.activities;

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === 'ios') {
        getOneTimeLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Location Access Required',
              message: 'This App needs to Access your location',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            getOneTimeLocation();
          } else {
            console.log('Permission Denied');
          }
        } catch (err) {
          console.warn('err', err);
        }
      }
    };
    requestLocationPermission();
  }, []);

  const getOneTimeLocation = () => {
    Geolocation.getCurrentPosition(
      //Will give you the current location
      (position) => {
        //getting the Longitude from the location json
        const currentLongitude =
          JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude =
          JSON.stringify(position.coords.latitude);

        dispatch(userActions.updateUserLocation({ lat: currentLatitude, lng: currentLongitude }))
        //Setting Longitude state
      },
      (error) => {
        console.log(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 40000,
        maximumAge: 1000
      },
    );
  };

  useEffect(() => {
    let data = {};

    dispatch(activitiesActions.getActivitiesCategories(data));
  }, [appLanguage]);

  const returnData = () => {
    let data = { user_id, ...filters };

    if (search) {
      data.title = search;
    } else {
      data.title = '';
    }

    return data;
  };

  useEffect(() => {
    let data = returnData();
    dispatch(
      activitiesActions.getSubscriptionsActivities(
        {
          ...data,
          subscriptions: true,
          friends: false
        },
        true,
      ),
    );

    dispatch(
      activitiesActions.getFriendsActivities(
        {
          ...data,
          subscriptions: false,
          friends: true
        },
        true,
      ),
    );

    dispatch(
      activitiesActions.getActivities({ ...data, subscriptions: false, friends: false }, true),
    );

    // setRefresh(false);
  }, [search, appLanguage, partner, filters]);




  useEffect(() => {
    let data = returnData();

    if (tab === 'friends') {
      setPageFriends(0)
      console.log('friends', pageFriends)
      dispatch(
        activitiesActions.getFriendsActivities(
          {
            ...data,
            subscriptions: false,
            friends: true
          },
          true,
        ),
      );
    } else if (tab === 'actual') {
      setPageActivities(0);
      console.log('actual', pageActivities)
      dispatch(
        activitiesActions.getActivities({ ...data, subscriptions: false, friends: false }, true),
      );
    } else if (tab === 'followings') {
      setPageSubscriptions(0)
      console.log('followings', pageSubscriptions)
      dispatch(
        activitiesActions.getSubscriptionsActivities(
          {
            ...data,
            subscriptions: true,
            friends: false
          },
          true,
        ),
      );
    }
  }, [tab])

  const handleRefreshListActivities = () => {
    setPageActivities(0);
    dispatch(
      activitiesActions.getActivities(
        {
          ...returnData(),
          friends: false,
          subscriptions: false,
        },
        true,
      ),
    );
  };

  const handleRefreshListActivitiesSubscriptions = () => {
    setPageSubscriptions(0);
    dispatch(
      activitiesActions.getSubscriptionsActivities(
        {
          ...returnData(),
          friends: false,
          subscriptions: true,
        },
        true,
      ),
    );
  };

  const handleRefreshListActivitiesFriends = () => {
    setPageFriends(0);
    dispatch(
      activitiesActions.getFriendsActivities(
        {
          ...returnData(),
          subscriptions: false,
          friends: true,
        },
        true,
      ),
    );
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

  const subscribeControl = (data, subscribe, item) => {
    if (subscribe) {
      dispatch(activitiesActions.unsubscribeActivity(data));
    } else {
      dispatch(activitiesActions.subscribeActivitiy(data, item));
    }
  };

  const renderItem = useCallback(
    ({ item }) => (
      <ActivitiesCard
        language={appLanguage === 'ua' ? 'uk' : appLanguage}
        subscribeControl={subscribeControl}
        navigation={props.navigation}
        item={item}
        btnLoading={subscribeActivityLoading}
        user_id={user_id}
        translations={translations}
      />
    ),
    [appLanguage],
  );

  const keyExtractor = useCallback(item => item.id.toString(), []);
  const itemSeperator = useCallback(() => <View style={{ height: 16 }} />, []);

  const renderList = (data, handleRefreshList, loading, scrollY) => {
    return (
      <FlatList
        ListEmptyComponent={() => (
                tab === 'actual' ? (

          <View
            style={{
              width: '100%',
              height: DEVICE_HEIGHT * 0.7,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              
            <Entypo name='documents' size={80} color={'grey'} />
            <View mTop={24}>
            <Text size={16} color={'grey'} center>{translations.noResultsActual}</Text>
            </View>
          </View>
                ) :  tab === 'followings' ? (
           <View
            style={{
              width: '100%',
              height: DEVICE_HEIGHT * 0.7,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              
            <Entypo name='documents' size={80} color={'grey'} />
            <View mTop={24}>
               <Text size={16} color={'grey'} center>{translations.noResultsFollowings}</Text>
            </View>
          </View>
                ) : (
                           
                  <View
            style={{
              width: '100%',
              height: DEVICE_HEIGHT * 0.7,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              
            <Entypo name='documents' size={80} color={'grey'} />
            <View mTop={24}>
              <Text size={16} color={'grey'} center>{translations.noResultsFriends}</Text>
            </View>
          </View>
                )
        )}
        decelerationRate="fast"
        windowSize={10}
        maxToRenderPerBatch={5}
        ItemSeparatorComponent={itemSeperator}
        refreshing={loading}
        onRefresh={handleRefreshList}
        renderItem={renderItem}
        onEndReachedThreshold={1}
        onEndReached={loadMoreData}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatList}
        data={data}
        keyExtractor={keyExtractor}
      />
    );
  };

  const renderPager = useCallback(
    () =>
      tab === 'actual' ? (
        <View key="0" flex>
          {renderList(
            activities.activities,
            handleRefreshListActivities,
            activitiesLoading,
          )}
        </View>
      ) : tab === 'followings' ? (
        <View key="1" flex>
          {renderList(
            subscriptionActivities.activities,
            handleRefreshListActivitiesSubscriptions,
            subscriptionActivitiesLoading,
          )}
        </View>
      ) : (
        <View key="2" flex>
          {renderList(
            friendsActivities.activities,
            handleRefreshListActivitiesFriends,
            friendsActivitiesLoading,
          )}
        </View>
      ),
    [activities, subscriptionActivities, friendsActivities, tab],
  );

  const loadMoreData = () => {
    if (tab === 'actual') {
      setPageActivities(pageActivities + 1);
      dispatch(
        activitiesActions.getActivities(
          { ...returnData(), page: pageActivities + 1, subscriptions: false },
          false,
        ),
      );
    } else if (tab === 'followings') {
      setPageSubscriptions(pageSubscriptions + 1);
      dispatch(
        activitiesActions.getSubscriptionsActivities(
          {
            ...returnData(),
            subscriptions: true,
            page: pageSubscriptions + 1,
          },
          false,
        ),
      );
    } else if (tab === 'friends') {
      setPageFriends(pageFriends + 1);
      dispatch(
        activitiesActions.getFriendsActivities(
          {
            ...returnData(),
            subscriptions: false,
            page: pageFriends + 1,
          },
          false,
        ),
      );
    }
  };

  return (
    <View flex style={{ backgroundColor: 'white' }}>
      <FiltersActivities
        translations={translations}
        appLanguage={appLanguage}
        activitiesCategories={activities_categories}
        setFilters={setFilters}
        setFilterModalVisible={setFilterModalVisible}
        filterModalVisible={filterModalVisible}
      />
      <SearchActivities
        isVisible={!hideSearch}
        setIsVisible={setHideSearch}
        search={search}
        data={data}
        setSearch={setSearch}
        translations={translations}
      />
      <StatusBar animated barStyle={'dark-content'} />
      <CustomSafeAreaView>
        <View
          style={{ paddingHorizontal: 16, paddingBottom: 8, zIndex: 9 }}
          row
          centered
          sBetween>
          <View style={{ width: '100%' }}>
            <View row sBetween centered>
              <TouchableOpacity onPress={() => setOpenMenu(!openMenu)}>
                <View style={{ backgroundColor: 'white', flexDirection: 'row', alignItems: 'center' }}>
                  <Text size={20} mRight={8} bold >{tabs.find(el => el.key === tab).title}</Text>
                  <Icon name={openMenu ? 'chevron-up-outline' : 'chevron-down-outline'} size={18} color={'grey'} />
                </View>
              </TouchableOpacity>
              <View row centered>
                <TouchableOpacity
                  style={{ marginRight: 16 }}
                  onPress={() => setHideSearch(!hideSearch)}>
                  {search.length ? <View style={{ ...styles.activeFilter, top: 7.8, left: 6.3 }} /> : null}
                  <Icon
                    name="search-outline"
                    size={24}
                    color={!hideSearch ? colors.mainBlue : 'grey'}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setFilterModalVisible(!filterModalVisible)}>
                  <Icon name="options-outline" size={24} color="grey" />
                  {Object.keys(filters).length != 0 && <View style={styles.activeFilter} />}
                </TouchableOpacity>
              </View>
            </View>
            {openMenu &&
              <View style={{ position: 'absolute', top: 30, zIndex: 9999 }}>
                <Shadow viewStyle={{ backgroundColor: 'white', zIndex: 9999, borderRadius: 14 }} distance={18} startColor={'#00000012'} finalColor={'transparent'}>
                  {tabs.map((el, index) => (
                    <TouchableOpacity key={el.key} style={{ borderColor: colors.lightGrey, borderBottomWidth: index === tabs.length - 1 ? 0 : 1, height: 40, flexDirection: 'row', alignItems: 'center', paddingLeft: 8, paddingRight: 22 }} onPress={() => { setTab(el.key); setOpenMenu(!openMenu); }}>
                      {tab === el.key && <Icon size={18} name={'checkmark-sharp'} />}
                      <Text size={16} mLeft={tab === el.key ? 4 : 22}>{el.title}</Text>
                    </TouchableOpacity>
                  ))}
                </Shadow>
              </View>
            }
          </View>
          {/* <Text size={24} style={{ fontWeight: '700', color: '#386ec7' }}>
            Leafy
          </Text> */}
        </View>
        {/* <View row centered style={styles.tabBar}>
          {returnTabBatton(translations.actual, true)}
          {returnTabBatton(translations.followings, false)}
        </View> */}
        {/* {
            !hideSearch && (
              <TextInput
                onChangeText={setSearch}
                placeholder={'Поиск'}
                style={styles.headerInput}
              />
            )
          } */}
      </CustomSafeAreaView >
      {renderPager()}
    </View>
  );
};

export default Home;
