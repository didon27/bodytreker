import React, {Fragment} from 'react';
import {TouchableOpacity} from 'react-native';
import {SliderBox} from 'react-native-image-slider-box';

import {colors} from 'colors';
import {View, Text, Button, Avatar} from 'components';
import {images} from 'images';
import {DEVICE_WIDTH} from 'constants';

import styles from './styles';
import {routeNames} from 'enums';
import {API} from 'constants';
import StarRating from 'react-native-star-rating';

function Header({activity, navigation}) {
  const {user} = activity;

  return (
    <Fragment>
      <View
        style={
          !activity.activities_images.length && {
            height: 160,
            backgroundColor: colors.mainBlue,
          }
        }>
        <SliderBox
          sliderBoxHeight={360}
          circleLoop
          imageLoadingColor={colors.mainBlue}
          inactiveSlideScale={1}
          paginationBoxVerticalPadding={0}
          enableMomentum
          images={activity.activities_images.map(
            item => API + '/images/' + item.filename,
          )}
          dotStyle={{
            width: DEVICE_WIDTH / activity.activities_images.length - 20,
            height: 4,
            maxWidth: 50,
          }}
          paginationBoxStyle={{marginBottom: 40}}
          dotColor={colors.mainBlue}
          inactiveDotColor={'white'}
        />
      </View>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={{flexDirection: 'row'}}
          onPress={() => navigation.push(routeNames.userProfile, {user})}>
          <Avatar user={user} style={{width: 60, height: 60}} />
          <View mLeft={10}>
            <Text size={20} style={{fontWeight: '700'}}>
              {user.first_name + ' ' + user.last_name}
            </Text>
            <Text size={15} style={{fontWeight: '500'}} color={'grey'}>
              @{user.username.toLowerCase()}
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
      </View>
    </Fragment>
  );
}

export default React.memo(Header);
