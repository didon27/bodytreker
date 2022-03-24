import React, { useEffect, useState } from 'react';
import FastImage from 'react-native-fast-image';
import StarRating from 'react-native-star-rating';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import 'moment/min/locales'

import { colors } from 'colors';
import {
  View,
  Text,
  Button,
  ItemCategory,
  Avatar,
  UserBlock,
  SubscribeButton,
  FixedTouchableHighlight,
} from 'components';
import { images } from 'images';

import styles from './styles';
import { routeNames } from 'enums';
import { API } from 'constants';
import { TouchableOpacity } from 'react-native-gesture-handler';

function ActivitiesCard({
  item,
  user_id,
  translations,
  loading,
  navigation,
  subscribeControl,
  language,
}) {
  let { user, title, createdAt, activities_categories, id, subscribe, status, verified_account } =
    item;
  const [_subscribe, _setSubscribe] = useState(subscribe)
  const [loadingBtn, setLoadingBtn] = useState(false);

  useEffect(() => {
    if (!loading) {
      setLoadingBtn(false);
    }
  }, [loading]);

  moment.locale(language);

  return (
    <FixedTouchableHighlight
      style={styles.container}
      onPress={
        () =>
          user_id === user.id ?
            navigation.navigate(routeNames.activityEdit, { activity: item })
            :
            navigation.push(routeNames.dateils, {
              screen: routeNames.activityDetails,
              params: {
                activity: item,
              },
            })
        // navigation.navigate(routeNames.dateils, {activity: item})
      }>
      <>
        {status?.text && (
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
        )}
        {/* <View row centered sBetween>
        <UserBlock user={user} navigation={navigation} />
        <TouchableOpacity>
          <Icon name="ellipsis-vertical" size={18} color={'grey'} />
        </TouchableOpacity>
      </View> */}
        <View row sBetween centered>
          <View row flex centered >
            <Avatar user={user} />
            <View row centered flex>
              <Text mRight={6} numberOfLines={1} size={16} medium mLeft={8}>{user.username}</Text>
              {user.verified_account && <Icon name="md-checkmark-circle" size={16} color={colors.mainBlue} />}
            </View>
          </View>
          <Text color={'grey'}>{moment(createdAt).startOf('hour').fromNow()}</Text>
        </View>
        <Text size={16} mTop={8} numberOfLines={3} >
          {title}
        </Text>
        {/* {activities_images[0]?.filename && (
        <FastImage
          source={{uri: API + '/images/' + activities_images[0]?.filename}}
          style={styles.image}
          resizeMode={FastImage.resizeMode.cover}
        />
      )} */}
        <View row centered style={{ flexWrap: 'wrap', marginTop: activities_categories.length ? 8 : 0 }}>
          {activities_categories.map((e, i) => (
            <ItemCategory key={i} item={e} />
          ))}
        </View>
        {user_id !== user.id &&
          !status?.status && (
            <SubscribeButton
              loading={loadingBtn}
              onPress={() => {
                if (user_id === user.id) {
                  navigation.navigate(routeNames.activityEdit, { activity: item });
                } else {
                  setLoadingBtn(true);
                  subscribeControl({ user_id, activity_id: id }, _subscribe, item);
                  _setSubscribe(!_subscribe);
                  setLoadingBtn(false);
                }
              }}
              style={{ marginTop: 8, height: 28 }}
              subscribe={_subscribe}
              text={
                user_id === user.id
                  ? translations.edit
                  : _subscribe
                    ? translations.following
                    : translations.follow
              }
            />
          )
        }
      </>
    </FixedTouchableHighlight >
  );
}

export default React.memo(ActivitiesCard);
