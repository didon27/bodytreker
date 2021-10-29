import React from 'react';
import {
  StatusBar,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  Image,
} from 'react-native';
import StarRating from 'react-native-star-rating';

import {colors} from 'colors';
import {authActions} from 'store/auth';
import {View, Text, Button} from 'components';
import {images} from 'images';
import {useSelector, useDispatch} from 'react-redux';

import styles from './styles';
import {storage} from 'services/storage';

const Home = props => {
  const {user} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const containerStyle = {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#21212f',
  };

  const logout = async () => {
    await storage.delete('UserToken');
    dispatch(authActions.removeTokenSuccess());
  };

  const data = [
    {
      username: 'Admin',
      avatar: images.startBackground,
      user_rating: 2.5,
      text: 'Прогулка на велосипедах',
      category: 'Спорт',
      createdAt: '2021-09-10',
    },
    {
      username: 'Admin2',
      avatar: images.startBackground,
      user_rating: 2,
      text: 'Выпить кофе',
      category: 'Спорт',
      createdAt: '2021-09-10',
    },
    {
      username: 'Admin3',
      avatar: images.startBackground,
      user_rating: 5,
      text: 'Прогулка',
      category: 'Спорт',
      createdAt: '2021-09-10',
    },
    {
      username: 'Admin3',
      avatar: images.startBackground,
      user_rating: 5,
      text: 'Прогулка',
      category: 'Спорт',
      createdAt: '2021-09-10',
    },
    {
      username: 'Admin3',
      avatar: images.startBackground,
      user_rating: 5,
      text: 'Прогулка',
      category: 'Спорт',
      createdAt: '2021-09-10',
    },
  ];

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
        <View row sBetween>
          <Text mTop={6}>{item.category}</Text>
          <Text color={'grey'}>{item.createdAt}</Text>
        </View>
        <Button text={'Подписаться'} style={{height: 36, marginTop: 16}} />
      </TouchableOpacity>
    );
  };
  return (
    <View flex style={{backgroundColor: 'white'}}>
      <StatusBar animated barStyle={'dark-content'} />
      <SafeAreaView>
        <View style={containerStyle}>
          <Text>{`Hi, ${user.username}`}</Text>
          <TouchableOpacity onPress={logout}>
            <Text color={'white'}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={{paddingHorizontal: 20}} row centered sBetween>
          <Text size={24}>Logo</Text>
          <TouchableOpacity>
            <Text>Filter</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <FlatList
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{padding: 20, paddingBottom: 40}}
        data={data}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

export default Home;
