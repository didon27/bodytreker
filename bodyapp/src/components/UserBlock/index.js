import {Avatar, Text, View} from 'components';
import {routeNames} from 'enums';
import React from 'react';
import {TouchableOpacity} from 'react-native';
import StarRating from 'react-native-star-rating';

const UserBlock = ({user, containerStyle, navigation}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.push(routeNames.userProfile, {user})}
      style={[{flexDirection: 'row'}, containerStyle && containerStyle]}>
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
    </TouchableOpacity>
  );
};

export default UserBlock;
