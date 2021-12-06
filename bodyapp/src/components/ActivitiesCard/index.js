import React, {useState} from 'react';
import {TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import {colors} from 'colors';
import {View, Text, Button, ItemCategory, Avatar} from 'components';
import {images} from 'images';

import styles from './styles';
import {routeNames} from 'enums';
import {API} from 'constants';

function ActivitiesCard({
  item,
  user_id,
  translations,
  navigation,
  subscribeControl,
}) {
  let {user, title, createdAt, activities_categories, id, subscribe} = item;

  const [loading, seLoading] = useState(false);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={
        () =>
          navigation.navigate(routeNames.dateils, {
            screen: routeNames.activityDetails,
            params: {
              activity: item,
            },
          })
        // navigation.navigate(routeNames.dateils, {activity: item})
      }>
      <View row centered sBetween>
        <View row>
          <Avatar user={user} />
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
      {/* {activities_images[0]?.filename && (
        <FastImage
          source={{uri: API + '/images/' + activities_images[0]?.filename}}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
      )} */}
      <View row centered style={{flexWrap: 'wrap'}}>
        {activities_categories.map((e, i) => (
          <ItemCategory key={i} item={e} />
        ))}
      </View>
      <Text color={'grey'}>{moment(createdAt).startOf('hour').fromNow()}</Text>
      <Button
        onPress={() => {
          seLoading(true);
          subscribeControl({user_id, activity_id: id}, subscribe, item);
        }}
        text={
          user_id === user.id
            ? translations.edit
            : subscribe
            ? 'Отписаться'
            : 'Подписаться'
        }
        style={styles.button}
        loading={loading}
      />
    </TouchableOpacity>
  );
}

export default React.memo(ActivitiesCard);
