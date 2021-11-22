import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import {colors} from 'colors';
import {View, Text, Button, ItemCategory} from 'components';
import {images} from 'images';
import {API} from 'constants';

import styles from './styles';
import {routeNames} from 'enums';

const ActivitiesCard = ({item, index, user_id, translations, navigation}) => {
  let {user, title, createdAt, activities_categories, activities_images} = item;

  return (
    <TouchableOpacity
      key={index}
      style={styles.container}
      onPress={() => navigation.navigate(routeNames.dateils)}>
      <View row centered sBetween>
        <View row>
          <Image source={images.startBackground} style={styles.avatar} />
          <View mLeft={10}>
            <Text size={15} style={{fontWeight: '500'}}>
              {user.username}
            </Text>
            <View style={{width: 10}}>
              <StarRating
                starStyle={{marginHorizontal: 1, marginTop: 2}}
                disabled={false}
                maxStars={5}
                starSize={10}
                rating={user.rating}
                emptyStarColor="#A2A3A5"
                fullStarColor={'#F5B942'}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity>
          <Icon name="ellipsis-vertical" size={18} color={'grey'} />
        </TouchableOpacity>
      </View>
      <Text size={18} mTop={8} style={{fontWeight: '500'}}>
        {title}
      </Text>
      {activities_images[0]?.filename && (
        <Image
          source={{uri: API + '/images/' + activities_images[0]?.filename}}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View row centered style={{flexWrap: 'wrap'}}>
        {activities_categories.map((e, i) => (
          <ItemCategory key={i} item={e} />
        ))}
      </View>
      <Text color={'grey'}>{moment(createdAt).startOf('hour').fromNow()}</Text>
      <Button
        text={user_id === user.id ? translations.edit : 'Подписаться'}
        style={styles.button}
      />
    </TouchableOpacity>
  );
};

export default React.memo(ActivitiesCard);
