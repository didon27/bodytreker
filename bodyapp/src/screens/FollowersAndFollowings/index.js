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

import { View, Text, CustomSafeAreaView, CheckBox, UserBlock } from 'components';
import { DefaultBackDrop } from 'components/BackDrop';
import { DEVICE_HEIGHT } from 'constants';
import { LocalizationContext } from 'services';
import { colors } from 'colors';
import { API_URL } from 'constants';
import { userActions } from 'store/user';
import { mamaAxios } from 'services/api';

import styles from './styles';

const FollowersAndFollowings = props => {
  const scrollYActivities = useRef(new Animated.Value(0)).current;
  const bottomSheetRef = useRef();

  const { appLanguage, translations } = useContext(LocalizationContext);

  const { user_id, type, username } = props.route.params;
  const [partner, setPartner] = useState(null);
  const [pageActivities, setPageActivities] = useState(0);
  const [search, setSearch] = useState('');
  const myId = useSelector(state => state.user.user.id);
  const [hideSearch, setHideSearch] = useState(true);

  const [loading, setLoading] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [users, setUsers] = useState([]);

  const dispatch = useDispatch();

  const snapPoints = useMemo(() => ['25%', '40%'], []);

  const returnData = () => {
    let data = { user_id };

    if (search.length >= 3) {
      data.username = search;
    } else {
      data.username = '';
    }

    if (partner) {
      data.partner = partner;
    }

    return data;
  };

  const fetchData = (data, refresh) => {
    setLoading(true);
    mamaAxios
      .post(`${API_URL}/user/get-user-followers-and-followings`, {
        ...data,
        type,
      })
      .then(response => {
        if (refresh) {
          setUsers(response.data.users);
        } else {
          setUsers(prevState => [...prevState, ...response.data.users]);
        }
        setLoading(false);
      })
      .catch(err => {
        setLoading(false);
        console.log('errorF', err.response.data);
      });
  };

  useEffect(() => {
    fetchData(returnData(), true);
  }, [search, appLanguage, partner, user_id]);

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

  const buttonControl = (id, subscribe) => {
    if (subscribe) {
      dispatch(
        userActions.unsubscribeUser(
          {
            first_user_id: myId,
            second_user_id: id,
          },
          () =>
            setUsers(prevState =>
              prevState.map(el =>
                el.id === id ? { ...el, subscribe: false } : el,
              ),
            ),
        ),
      );
    } else {
      dispatch(
        userActions.subscribeUser(
          {
            first_user_id: myId,
            second_user_id: id,
          },
          () =>
            setUsers(prevState =>
              prevState.map(el =>
                el.id === id ? { ...el, subscribe: true } : el,
              ),
            ),
        ),
      );
    }
  };

  const renderItem = useCallback(
    ({ item, index }) => (
      <UserBlock
        key={index}
        myId={myId}
        translations={translations}
        navigation={props.navigation}
        user={item}
        buttonControl={buttonControl}
        showButton
      />
    ),
    [subscribeLoading],
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
        onEndReachedThreshold={0.96}
        onEndReached={loadMoreData}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.flatList}
        data={users}
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
      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={DefaultBackDrop}
        onChange={handleSheetChanges}>
        <View
          style={{
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            paddingBottom: 16,
            borderColor: colors.lightGrey,
          }}>
          <Text size={20}>{translations.filters}</Text>
        </View>
        <BottomSheetScrollView
          style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
          <View style={styles.block} mTop={16}>
            <Text size={18} style={{ fontWeight: '600' }} mBottom={6}>
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
              onPress={() => setHideSearch(!hideSearch)}>
              <Icon
                name="search-outline"
                size={24}
                color={!hideSearch ? colors.mainBlue : 'grey'}
              />
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => bottomSheetRef.current.present()}>
              <Icon name="filter" size={24} color="grey" />
              <View style={styles.activeFilter} />
            </TouchableOpacity> */}
          </View>
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
      <View flex>{renderList()}</View>
    </View>
  );
};

export default FollowersAndFollowings;
