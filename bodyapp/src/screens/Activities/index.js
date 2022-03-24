import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
  useContext,
} from 'react';
import { StatusBar, TouchableOpacity, TextInput, Animated } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import IconAwesome from 'react-native-vector-icons/FontAwesome';
import { BottomSheetModal, BottomSheetScrollView } from '@gorhom/bottom-sheet';

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
import { API_URL } from 'constants';
import { mamaAxios } from 'services/api';

import styles from './styles';
import { FiltersActivities, SearchActivities } from 'layouts';

const Activities = props => {
  const scrollYActivities = useRef(new Animated.Value(0)).current;
  const bottomSheetRef = useRef();

  const { appLanguage, translations } = useContext(LocalizationContext);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [filters, setFilters] = useState({});
  const { user_id, username } = props.route.params;
  const [partner, setPartner] = useState(null);
  const [pageActivities, setPageActivities] = useState(0);
  const [search, setSearch] = useState('');
  const [hideSearch, setHideSearch] = useState(true);
  const { user } = useSelector(state => state.user);

  const [loading, setLoading] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [activities, setActivities] = useState([]);

  const snapPoints = useMemo(() => ['25%', '40%'], []);

  const returnData = () => {
    let data = { user_id, ...filters };

    if (search.length) {
      data.title = search;
    } else {
      data.title = '';
    }

    if (partner) {
      data.partner = partner;
    }

    return data;
  };

  const fetchData = (data, refresh) => {
    setLoading(true);
    mamaAxios
      .post(`${API_URL}/activities/get-my-activities`, {
        ...data,
        userActivities: true,
      })
      .then(response => {
        if (refresh) {
          setActivities(response.data.activities);
        } else {
          setActivities(prevState => [
            ...prevState,
            ...response.data.activities,
          ]);
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.log('error', err.response.data);
      });
  };

  useEffect(() => {
    fetchData(returnData(), true);
  }, [search, appLanguage, filters, user_id]);

  const handleRefreshListActivities = () => {
    setPageActivities(0);
    fetchData(returnData(), true);
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

  const headerBackgroundColor = scrollYActivities.interpolate({
    inputRange: [0, 100],
    outputRange: ['white', '#dddcdc'],
    extrapolate: 'clamp',
  });

  const subscribeControl = (data, subscribe, item) => {
    setSubscribeLoading(true);

    mamaAxios
      .post(
        `${API_URL}/activities/${!subscribe ? 'subscribe' : 'unsubscribe'
        }-activity`,
        data,
      )
      .then(() => {
        setActivities(prevState =>
          prevState.map(el =>
            el.id === data.activity_id ? { ...el, subscribe: !el.subscribe } : el,
          ),
        );
        setSubscribeLoading(false);
      })
      .catch(err => {
        setSubscribeLoading(false);
        console.log('error', err.response.data);
      });
  };

  const renderItem = useCallback(
    ({ item, index }) => (
      <ActivitiesCard
        language={appLanguage === 'ua' ? 'uk' : appLanguage}
        navigation={props.navigation}
        item={item}
        key={index}
        subscribeControl={subscribeControl}
        loading={subscribeLoading}
        user_id={user.id}
        translations={translations}
      />
    ),
    [subscribeLoading, appLanguage],
  );

  const keyExtractor = useCallback(item => item.id.toString(), []);

  const itemSeperator = useCallback(() => <View style={{ height: 16 }} />, []);

  const renderList = () => {
    return (
      <Animated.FlatList
        onScroll={Animated.event(
          [
            {
              nativeEvent: { contentOffset: { y: scrollYActivities } },
            },
          ],
          { useNativeDriver: false },
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
        onRefresh={handleRefreshListActivities}
        renderItem={renderItem}
        onEndReachedThreshold={1}
        onEndReached={loadMoreData}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatList}
        data={activities}
        keyExtractor={keyExtractor}
      />
    );
  };

  const loadMoreData = () => {
    setPageActivities(pageActivities + 1);
    fetchData({ ...returnData(), page: pageActivities + 1 }, false);
  };

  return (
    <View flex style={{ backgroundColor: 'white' }}>
      <FiltersActivities
        translations={translations}
        appLanguage={appLanguage}
        setFilters={setFilters}
        setFilterModalVisible={setFilterModalVisible}
        filterModalVisible={filterModalVisible}
      />
      <SearchActivities
        isVisible={!hideSearch}
        setIsVisible={setHideSearch}
        search={search}
        data={activities}
        setSearch={setSearch}
        translations={translations}
      />
      <StatusBar animated barStyle={'dark-content'} />
      <CustomSafeAreaView>
        <View
          style={{ paddingHorizontal: 16, paddingBottom: 8 }}
          row
          centered
          sBetween>
          <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <View row centered>
              <IconAwesome name="angle-left" size={30} color={'#585858'} />
              <Text size={18} mLeft={10} medium>
                {username.toLocaleLowerCase()}
              </Text>
            </View>
          </TouchableOpacity>
          <View row centered>
            <TouchableOpacity
              style={{ marginRight: 16 }}
              onPress={() => setHideSearch(!hideSearch)}>
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
        <Animated.View
          style={{
            width: '100%',
            height: 0.5,
            backgroundColor: headerBackgroundColor,
          }}
        />
      </CustomSafeAreaView>
      <View flex>{renderList()}</View>
    </View>
  );
};

export default Activities;
