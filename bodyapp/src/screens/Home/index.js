import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import {StatusBar, TouchableOpacity, TextInput, Animated} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';

import {activitiesActions} from 'store/activities';
import {
  View,
  Text,
  CustomSafeAreaView,
  CheckBox,
  ActivitiesCard,
} from 'components';
import {DefaultBackDrop} from 'components/BackDrop';
import {DEVICE_HEIGHT} from 'constants';
import {LocalizationContext} from 'services';
import {colors} from 'colors';

import styles from './styles';

const Home = props => {
  const scrollYActivities = useRef(new Animated.Value(0)).current;
  const scrollYSubscriptions = useRef(new Animated.Value(0)).current;

  const bottomSheetRef = useRef();

  const {appLanguage, translations} = useContext(LocalizationContext);
  const {user} = useSelector(state => state.user);

  const user_id = user.id;
  const [partner, setPartner] = useState(null);
  const [pageActivities, setPageActivities] = useState(0);
  const [pageSubscriptions, setPageSubscriptions] = useState(0);
  const [tab, setTab] = useState(true);
  const [search, setSearch] = useState('');
  const [hideSearch, setHideSearch] = useState(true);

  const {
    activities,
    subscriptionActivities,
    activitiesLoading,
    subscriptionActivitiesLoading,
    subscribeActivityLoading,
  } = useSelector(state => state.activities);

  const dispatch = useDispatch();

  const snapPoints = useMemo(() => ['25%', '40%'], []);

  const returnData = () => {
    let data = {user_id};

    if (search.length >= 3) {
      data.title = search;
    } else {
      data.title = '';
    }

    if (partner) {
      data.partner = partner;
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
        },
        true,
      ),
    );

    dispatch(activitiesActions.getActivities(data, true));

    // setRefresh(false);
  }, [search, appLanguage, partner]);

  const handleRefreshListActivities = () => {
    setPageActivities(0);
    dispatch(activitiesActions.getActivities(returnData(), true));
  };

  const handleRefreshListActivitiesSubscriptions = () => {
    setPageSubscriptions(0);
    dispatch(
      activitiesActions.getSubscriptionsActivities(
        {
          ...returnData(),
          subscriptions: true,
        },
        true,
      ),
    );
  };

  const returnTabBatton = (title, status) => {
    return (
      <TouchableOpacity
        onPress={() => setTab(status)}
        style={{
          ...styles.tab,
          backgroundColor: tab === status ? '#4285f4' : '#f4f4f4',
        }}>
        <Text
          color={tab === status && 'white'}
          style={{fontWeight: tab === status ? '600' : '400'}}>
          {title}{' '}
          {!status && (
            <Text style={{fontWeight: '700'}}>
              ({subscriptionActivities.totalItems})
            </Text>
          )}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleSheetChanges = useCallback(index => {
    console.log('handleSheetChanges', index);
  }, []);

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

  const headerBackgroundColor = tab
    ? scrollYActivities.interpolate({
        inputRange: [0, 100],
        outputRange: ['white', '#dddcdc'],
        extrapolate: 'clamp',
      })
    : scrollYSubscriptions.interpolate({
        inputRange: [0, 100],
        outputRange: ['white', '#dddcdc'],
        extrapolate: 'clamp',
      });

  const renderItem = useCallback(
    ({item}) => (
      <ActivitiesCard
        subscribeControl={subscribeControl}
        navigation={props.navigation}
        item={item}
        btnLoading={subscribeActivityLoading}
        user_id={user_id}
        translations={translations}
      />
    ),
    [],
  );

  const keyExtractor = useCallback(item => item.id.toString(), []);

  const itemSeperator = useCallback(() => <View style={{height: 16}} />, []);

  const renderList = (data, handleRefreshList, loading, scrollY) => {
    return (
      <Animated.FlatList
        onScroll={Animated.event(
          [
            {
              nativeEvent: {contentOffset: {y: scrollY}},
            },
          ],
          {useNativeDriver: false},
        )}
        ListEmptyComponent={() => (
          <View
            style={{
              width: '100%',
              height: DEVICE_HEIGHT * 0.7,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text>К сожелению нету активити</Text>
          </View>
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
      tab ? (
        <View key="0" flex>
          {renderList(
            activities.activities,
            handleRefreshListActivities,
            activitiesLoading,
            scrollYActivities,
          )}
        </View>
      ) : (
        <View key="1" flex>
          {renderList(
            subscriptionActivities.activities,
            handleRefreshListActivitiesSubscriptions,
            subscriptionActivitiesLoading,
            scrollYSubscriptions,
          )}
        </View>
      ),
    [activities, subscriptionActivities, tab],
  );

  const loadMoreData = () => {
    if (tab) {
      setPageActivities(pageActivities + 1);
      dispatch(
        activitiesActions.getActivities(
          {...returnData(), page: pageActivities + 1},
          false,
        ),
      );
    } else {
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
    }
  };

  return (
    <View flex style={{backgroundColor: 'white'}}>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={DefaultBackDrop}
        onChange={handleSheetChanges}>
        <View
          style={{
            paddingHorizontal: 20,
            borderBottomWidth: 1,
            paddingBottom: 16,
            borderColor: colors.lightGrey,
          }}>
          <Text size={20}>{translations.filters}</Text>
        </View>
        <BottomSheetScrollView
          style={{paddingHorizontal: 20, paddingBottom: 20}}>
          <View style={styles.block} mTop={16}>
            <Text size={18} style={{fontWeight: '600'}} mBottom={6}>
              {translations.who_would_you_like}
            </Text>
            {returnPartnerCheckbox(translations.a_man, 0)}
            {returnPartnerCheckbox(translations.a_women, 1)}
            {returnPartnerCheckbox(translations.by_the_company, 2)}
            {returnPartnerCheckbox(translations.all_the_same, null)}
          </View>
        </BottomSheetScrollView>
      </BottomSheetModal>
      <StatusBar animated barStyle={'dark-content'} />
      <CustomSafeAreaView>
        <View
          style={{paddingHorizontal: 20, paddingBottom: 8}}
          row
          centered
          sBetween>
          <Text size={24} style={{fontWeight: '700', color: '#386ec7'}}>
            Leafy
          </Text>
          <View row centered>
            <TouchableOpacity
              style={{marginRight: 16}}
              onPress={() => setHideSearch(!hideSearch)}>
              <Icon
                name="search-outline"
                size={24}
                color={!hideSearch ? colors.mainBlue : 'grey'}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => bottomSheetRef.current.present()}>
              <Icon name="filter" size={24} color="grey" />
              <View style={styles.activeFilter} />
            </TouchableOpacity>
          </View>
        </View>
        <View row centered style={styles.tabBar}>
          {returnTabBatton(translations.actual, true)}
          {returnTabBatton(translations.my, false)}
        </View>
        {!hideSearch && (
          <TextInput
            onChangeText={setSearch}
            placeholder={'Поиск'}
            style={styles.headerInput}
          />
        )}
        <Animated.View
          style={{
            width: '100%',
            height: 0.5,
            backgroundColor: headerBackgroundColor,
          }}
        />
      </CustomSafeAreaView>
      {renderPager()}
    </View>
  );
};

export default Home;
