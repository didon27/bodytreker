import React, {useEffect, useState, useRef, useMemo, useCallback} from 'react';
import {
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Animated,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';

import {colors} from 'colors';
import {activitiesActions} from 'store/activities';
import {View, Text} from 'components';
import {storage} from 'services/storage';
import Icon from 'react-native-vector-icons/Ionicons';
import ActivitiesCard from './components/ActivitiesCard';

import {DefaultBackDrop} from 'components/BackDrop';

import {BottomSheetModal} from '@gorhom/bottom-sheet';

import styles from './styles';

const Home = props => {
  const {user} = useSelector(state => state.user);
  const user_id = user.id;
  const initialTab = props.route;
  const {activities} = useSelector(state => state.activities);
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;
  const [hideScrollToTopButton, setHideScrollToTopButton] = useState(false);
  const scrollRef = useRef();
  const [hideShadowHeader, setHideShadowHeader] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const [hideSearch, setHideSearch] = useState(true);
  const [tab, setTab] = useState(true || initialTab);

  const bottomSheetRef = useRef();

  // variables
  const snapPoints = useMemo(() => ['25%', '40%'], []);

  useEffect(() => {
    let data = {user_id, actual: tab};

    if (search.length >= 3) {
      data.title = search;
    }

    dispatch(activitiesActions.getActivities(data));

    setRefresh(false);
  }, [tab, refresh, search, initialTab]);

  useEffect(() => {
    scrollY.addListener(({value}) => {
      if (value <= 10) {
        setHideShadowHeader(true);
      } else {
        setHideShadowHeader(false);
      }

      if (value > 100) {
        setHideScrollToTopButton(true);
      } else {
        setHideScrollToTopButton(false);
      }
    });
    return () => {
      scrollY.removeAllListeners();
    };
  }, [hideSearch, scrollY]);

  const handleRefreshList = () => {
    setRefresh(true);
  };

  const renderItem = ({item, index}) => {
    return <ActivitiesCard item={item} index={index} user_id={user_id} />;
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

  return (
    <View flex style={{backgroundColor: 'white'}}>
      <BottomSheetModal
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        backdropComponent={DefaultBackDrop}
        onChange={handleSheetChanges}>
        <View style={styles.contentContainer}>
          <Text>Awesome 🎉</Text>
        </View>
      </BottomSheetModal>
      <StatusBar animated barStyle={'dark-content'} />
      <SafeAreaView style={!hideShadowHeader && styles.shadowHeader}>
        <View>
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
                <Icon name="search-outline" size={24} color="grey" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => bottomSheetRef.current.present()}>
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
        </View>
      </SafeAreaView>
      <Animated.FlatList
        ref={scrollRef}
        scrollEventThrottle={1}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {contentOffset: {y: scrollY}},
            },
          ],
          {useNativeDriver: true},
        )}
        refreshing={refresh}
        onRefresh={handleRefreshList}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View row centered style={styles.tabBar}>
            {returnTabBatton('Актиальные', true)}
            {returnTabBatton('Мои', false)}
          </View>
        )}
        contentContainerStyle={styles.flatList}
        data={activities}
        keyExtractor={(_, index) => index.toString()}
      />
      {hideScrollToTopButton && (
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
      )}
    </View>
  );
};

export default Home;
