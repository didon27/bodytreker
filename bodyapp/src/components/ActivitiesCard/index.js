import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import FastImage from 'react-native-fast-image';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';

import {colors} from 'colors';
import {
  View,
  Text,
  Button,
  ItemCategory,
  Avatar,
  UserBlock,
  SubscribeButton,
} from 'components';
import {images} from 'images';

import styles from './styles';
import {routeNames} from 'enums';
import {API} from 'constants';

function ActivitiesCard({
  item,
  user_id,
  translations,
  loading,
  navigation,
  subscribeControl,
}) {
  let {user, title, createdAt, activities_categories, id, subscribe, status} =
    item;

  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    if (!loading) {
      setLoadingBtn(false);
    }
  }, [loading]);

  return (
    <TouchableOpacity
      style={{
        ...styles.container,
        ...(status?.color && {borderWidth: 1, borderColor: status?.color}),
      }}
      onPress={
        () =>
          navigation.push(routeNames.dateils, {
            screen: routeNames.activityDetails,
            params: {
              activity: item,
            },
          })
        // navigation.navigate(routeNames.dateils, {activity: item})
      }>
      {/* {status?.text && (
        <View
          style={{
            backgroundColor: status.color,
            position: 'absolute',
            right: 0,
            paddingHorizontal: 12,
            paddingVertical: 4,
            borderBottomLeftRadius: 14,
            borderTopRightRadius: 14,
          }}>
          <Text size={12} medium color={colors.white}>
            {status.text}
          </Text>
        </View>
      )} */}
      <View row centered sBetween>
        <View row>
          <View flex>
            <UserBlock user={user} navigation={navigation} />
          </View>
          <Text color={colors.grey} medium>
            {moment(createdAt).startOf('hour').fromNow()}
          </Text>
        </View>
        {/* <TouchableOpacity>
          <Icon name="ellipsis-vertical" size={18} color={'grey'} />
        </TouchableOpacity> */}
      </View>
      <Text size={16} mTop={8} style={{fontWeight: '500'}} numberOfLines={3}>
        {title}
      </Text>
      {/* {activities_images[0]?.filename && (
        <FastImage
          source={{uri: API + '/images/' + activities_images[0]?.filename}}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
      )} */}
      <View
        row
        centered
        style={{
          flexWrap: 'wrap',
          marginTop: activities_categories.length ? 16 : 8,
        }}>
        {activities_categories.map((e, i) => (
          <ItemCategory key={i} item={e} size={'small'} />
        ))}
      </View>

      {!status?.status && (
        <SubscribeButton
          loading={loadingBtn}
          onPress={() => {
            if (user_id === user.id) {
              navigation.navigate(routeNames.activityEdit, {activity: item});
            } else {
              setLoadingBtn(true);
              subscribeControl({user_id, activity_id: id}, subscribe, item);
            }
          }}
          style={{marginTop: 8}}
          subscribe={subscribe}
          text={
            user_id === user.id
              ? translations.edit
              : subscribe
              ? translations.following
              : translations.follow
          }
        />
      )}
    </TouchableOpacity>
  );
}

export default React.memo(ActivitiesCard);
