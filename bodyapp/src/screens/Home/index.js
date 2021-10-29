import React, {useEffect, useState, useRef} from 'react';
import {
  StatusBar,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
  TextInput,
  Animated,
} from 'react-native';
import StarRating from 'react-native-star-rating';

import {colors} from 'colors';
import {authActions} from 'store/auth';
import {View, Text, Button} from 'components';
import {images} from 'images';
import {useSelector, useDispatch} from 'react-redux';

import styles from './styles';
import {storage} from 'services/storage';
import {ActivityIndicator} from 'react-native';

const Home = props => {
  const {user} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [hideShadowHeader, setHideShadowHeader] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    scrollY.addListener(({value}) => {
      if (value >= 0 && value <= 40) {
        setHideShadowHeader(value / 200);
      }
    });
    return () => {
      scrollY.removeAllListeners();
    };
  }, []);

  const data = [
    {
      username: 'Admin',
      avatar: images.startBackground,
      image: null,
      user_rating: 2.5,
      text: 'Прогулка на велосипедах',
      category: 'Спорт',
      createdAt: '2021-09-10',
    },
    {
      username: 'Admin2',
      avatar: images.startBackground,
      image: images.startBackground,
      user_rating: 2,
      text: 'Выпить кофе',
      category: 'Спорт',
      createdAt: '2021-09-10',
    },
    {
      username: 'Admin3',
      avatar: images.startBackground,
      images: null,
      user_rating: 5,
      text: 'Прогулка',
      category: 'Спорт',
      createdAt: '2021-09-10',
    },
    {
      username: 'Admin3',
      avatar: images.startBackground,
      image: null,
      user_rating: 5,
      text: 'Прогулка',
      category: 'Спорт',
      createdAt: '2021-09-10',
    },
    {
      username: 'Admin3',
      avatar: images.startBackground,
      image: null,
      user_rating: 5,
      text: 'Прогулка',
      category: 'Спорт',
      createdAt: '2021-09-10',
    },
  ];

  const handleRefreshList = () => {
    setTimeout(() => {
      setRefresh(false);
    }, 800);
  };

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        style={{
          marginBottom: 16,
          backgroundColor: 'white',
          borderRadius: 14,
          paddingRight: 20,
          padding: 16,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.2,
          shadowRadius: 4,

          elevation: 4,
        }}>
        <View row centered>
          <Image
            source={images.startBackground}
            style={{width: 34, height: 34, borderRadius: 17}}
          />
          <View mLeft={10}>
            <Text size={15} style={{fontWeight: '500'}}>
              {item.username}
            </Text>
            <StarRating
              starStyle={{marginHorizontal: 1, marginTop: 2}}
              disabled={false}
              maxStars={5}
              starSize={10}
              rating={item.user_rating}
              emptyStarColor="#A2A3A5"
              fullStarColor={'#F5B942'}
            />
          </View>
        </View>
        <Text size={18} mTop={8} style={{fontWeight: '500'}}>
          {item.text}
        </Text>
        {item.image && (
          <Image
            source={item.image}
            style={{
              height: 160,
              width: '100%',
              borderRadius: 14,
              marginTop: 10,
            }}
            resizeMode="cover"
          />
        )}
        <View row sBetween centered mTop={6}>
          <Text>{item.category}</Text>
          <Text color={'grey'}>{item.createdAt}</Text>
        </View>
        <Button
          text={'Присойденится'}
          style={{height: 36, flex: 1, marginTop: 16}}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View flex style={{backgroundColor: 'white'}}>
      <StatusBar animated barStyle={'dark-content'} />
      <SafeAreaView
        style={
          // hideShadowHeader &&
          {
            zIndex: 9999,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: hideShadowHeader,
            shadowRadius: 4,

            elevation: 4,
          }
        }>
        <View
          style={{paddingHorizontal: 20, paddingBottom: 10}}
          row
          centered
          sBetween>
          <Text size={24}>Logo</Text>
          <TouchableOpacity>
            <Text>Filter</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <Animated.FlatList
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
          <TextInput
            placeholder={'Поиск'}
            style={{
              backgroundColor: '#f4f4f4',
              height: 46,
              marginBottom: 20,
              borderRadius: 14,
              paddingHorizontal: 16,
              fontSize: 16,
            }}
          />
        )}
        contentContainerStyle={{paddingHorizontal: 20, paddingBottom: 40}}
        data={data}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

export default Home;
