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
  ];

  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        key={index}
        style={{
          backgroundColor: 'white',
          marginBottom: 10,
          borderRadius: 14,
          paddingRight: 20,
          paddingTop: 10, 
          paddingBottom: 10,
        }}>
        <View row centered>
          <Image
            source={images.startBackground}
            style={{width: 40, height: 40, borderRadius: 20}}
          />
          <View mLeft={10}>
            <Text size={16} style={{fontWeight: '500'}}>
              {item.username}
            </Text>
            <StarRating
              starStyle={{marginHorizontal: 1, marginTop: 2}}
              disabled={false}
              maxStars={5}
              starSize={12}
              rating={item.user_rating}
              emptyStarColor="#A2A3A5"
              fullStarColor={'#F5B942'}
            />
          </View>
        </View>
        <Text size={18} mTop={8}>
          {item.text}
        </Text>
        <View row sBetween>
          <Text mTop={6}>{item.category}</Text>
          <Text>{item.createdAt}</Text>
        </View>
        <Button text={'Подписаться'} style={{height: 36}} />
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
        ItemSeparatorComponent={() => (
          <View style={{height: 1, backgroundColor: 'grey'}} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingLeft: 10, paddingTop: 20, paddingBottom: 40}}
        data={data}
        keyExtractor={(_, index) => index.toString()}
      />
    </View>
  );
};

export default Home;
