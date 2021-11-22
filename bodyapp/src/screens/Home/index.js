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

import {activitiesActions} from 'store/activities';
import {View, Text, CustomSafeAreaView, CheckBox} from 'components';
import Icon from 'react-native-vector-icons/Ionicons';
import ActivitiesCard from './components/ActivitiesCard';

import {DefaultBackDrop} from 'components/BackDrop';

import {BottomSheetModal, BottomSheetScrollView} from '@gorhom/bottom-sheet';

import styles from './styles';
import {DEVICE_HEIGHT} from 'constants';
import {LocalizationContext} from 'services';
import {colors} from 'colors';

const Home = props => {
  const {appLanguage, translations} = useContext(LocalizationContext);
  const {user} = useSelector(state => state.user);
  const user_id = user.id;
  const initialTab = props.route;
  const [partner, setPartner] = useState(null);
  const {activities, myActivities} = useSelector(state => state.activities);
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;
  const [refresh, setRefresh] = useState(false);
  const [hideSearch, setHideSearch] = useState(true);
  const [tab, setTab] = useState(true || initialTab);

  const bottomSheetRef = useRef();

  // variables
  const snapPoints = useMemo(() => ['25%', '40%'], []);

  useEffect(() => {
    let data = {user_id};

    if (search.length >= 3) {
      data.title = search;
    }

    if (partner) {
      data.partner = partner;
    }

    dispatch(activitiesActions.getActivities({...data, actual: true}));

    setTimeout(() => {
      dispatch(activitiesActions.getActivities({...data, actual: false}));
    }, 400);

    setRefresh(false);
  }, [refresh, search, initialTab, appLanguage, partner]);

  const handleRefreshList = () => {
    setRefresh(true);
  };

  const returnTabBatton = (title, status) => {
    return (
      <TouchableOpacity
        onPress={() => setTab(!tab)}
        style={{
          ...styles.tab,
          backgroundColor: tab === status ? '#4285f4' : '#f4f4f4',
        }}>
        <Text
          color={tab === status && 'white'}
          style={{fontWeight: tab === status ? '600' : '400'}}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleSheetChanges = useCallback((index: number) => {
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

  const headerBackgroundColor = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: ['white', '#dddcdc'],
    extrapolate: 'clamp',
  });

  return (
    <View flex style={{backgroundColor: 'white'}}>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={DefaultBackDrop}
        onChange={handleSheetChanges}>
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
          style={{paddingHorizontal: 20, paddingBottom: 20}}
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
      <Animated.FlatList
        scrollEventThrottle={1}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {contentOffset: {y: scrollY}},
            },
          ],
          {useNativeDriver: false},
        )}
        initialNumToRender={6}
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
        ItemSeparatorComponent={() => <View style={{height: 16}} />}
        refreshing={refresh}
        onRefresh={handleRefreshList}
        renderItem={({item, index}) => (
          <ActivitiesCard
            navigation={props.navigation}
            item={item}
            index={index}
            user_id={user_id}
            translations={translations}
          />
        )}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View row centered style={styles.tabBar}>
            {returnTabBatton(translations.actual, true)}
            {returnTabBatton(translations.my, false)}
          </View>
        )}
        contentContainerStyle={styles.flatList}
        data={tab ? activities : myActivities}
        keyExtractor={(_, index) => index.toString()}
      />
      {/* {hideScrollToTopButton && (
        <TouchableOpacity
          onPress={() =>
            scrollRef.current.scrollToOffset({
              animated: true,
              offset: 0,
            })
          }
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            zIndex: 9999,
          }}>
          <Icon name="chevron-up-circle-sharp" size={48} color={'#386ec7'} />
        </TouchableOpacity>
      )} */}
    </View>
  );
};

export default Home;
