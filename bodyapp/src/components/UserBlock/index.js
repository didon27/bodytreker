import {colors} from 'colors';
import {Avatar, Button, SubscribeButton, Text, View} from 'components';
import {routeNames} from 'enums';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import StarRating from 'react-native-star-rating';

const UserBlock = ({
  user,
  containerStyle,
  navigation,
  showButton,
  myId,
  buttonControl,
  translations,
  statusBtn,
  authorActivity,
}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.push(routeNames.userProfile, {user})}
      style={[{flexDirection: 'row'}, containerStyle && containerStyle]}>
      <Avatar user={user} />
      <View row centered sBetween flex>
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
        {showButton && myId !== user.id && (
          <SubscribeButton
            onPress={() => buttonControl(user.id, user.subscribe)}
            subscribe={user.subscribe}
            text={user.subscribe ? translations.following : translations.follow}
          />
        )}
        {statusBtn && authorActivity === myId && (
          <TouchableOpacity
            onPress={() => buttonControl(user.id)}
            style={{
              backgroundColor: user.status ? colors.mainGreen : 'grey',
              height: 30,
              alignItems: 'center',
              borderRadius: 8,
              justifyContent: 'center',
              paddingHorizontal: 10,
            }}>
            <Text color={colors.white}>
              {user.status ? 'Оценить' : 'Пригласить'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default UserBlock;
