import React, { Fragment } from 'react';
import { TouchableOpacity } from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';

import { colors } from 'colors';
import { View, Text, Button, SubscribeButton } from 'components';
import { images } from 'images';
import { DEVICE_WIDTH } from 'constants';

import styles from './styles';
import { routeNames } from 'enums';
import { API } from 'constants';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

function Header({
  translations,
  myAccount,
  user,
  navigation,
  headerButtonLoading,
  headerButtonControl,
}) {
  return (
    <Fragment>
      <LinearGradient
        colors={['#0057b8', '#ffd700']}
        style={
          !user.images.length && { height: 160, backgroundColor: colors.mainBlue }
        }>
        <SliderBox
          sliderBoxHeight={360}
          circleLoop
          imageLoadingColor={colors.mainBlue}
          inactiveSlideScale={1}
          activeOpacity={1}
          paginationBoxVerticalPadding={0}
          enableMomentum
          images={user.images.map(item => API + '/images/' + item.filename)}
          dotStyle={{
            width: DEVICE_WIDTH / user.images.length - 20,
            height: 4,
            maxWidth: 50,
          }}
          paginationBoxStyle={{ marginBottom: 40 }}
          dotColor={colors.mainBlue}
          inactiveDotColor={'white'}
        />
      </LinearGradient>
      <View style={styles.headerContainer}>
        <View
          style={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            flexDirection: 'row'
          }}>
          <View sBetween flex>
            <View flex row centered>
              <Text size={18} bold  numberOfLines={1} mRight={8}>
                {user.first_name + ' ' + user.last_name}
              </Text>
              {user.verified_account && <Icon name="md-checkmark-circle" size={16} color={colors.mainBlue} />}
            </View>
            <Text color={'grey'}>
              @{user.username.toLocaleLowerCase()}
            </Text>
          </View>
          <SubscribeButton
            loading={headerButtonLoading}
            onPress={headerButtonControl}
            subscribe={user.subscribe}
            text={
              myAccount
                ? translations.edit
                : user.subscribe
                  ? translations.following
                  : translations.follow
            }
          />
        </View>

        <View row centered sBetween style={styles.counterBlock}>
          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={() =>
              navigation.push(routeNames.activities, {
                user_id: user.id,
                username: user.username,
              })
            }>
            <Text size={22} color={colors.mainBlue} style={{ fontWeight: '600' }}>
              {user.activities ? user.activities : 0}
            </Text>
            <Text mTop={4} color={'grey'} style={{ fontWeight: '500' }}>
              {translations.publications}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={() =>
              navigation.push(routeNames.followersAndFollowings, {
                type: 'followers',
                user_id: user.id,
                username: user.username,
              })
            }>
            <Text size={22} color={colors.mainBlue} style={{ fontWeight: '600' }}>
              {user.followers ? user.followers : 0}
            </Text>
            <Text mTop={4} color={'grey'} style={{ fontWeight: '500' }}>
              {translations.followers}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={() =>
              navigation.push(routeNames.followersAndFollowings, {
                type: 'followings',
                user_id: user.id,
                username: user.username,
              })
            }>
            <Text size={22} color={colors.mainBlue} style={{ fontWeight: '600' }}>
              {user.followings ? user.followings : 0}
            </Text>
            <Text mTop={4} color={'grey'} size={14} style={{ fontWeight: '500' }}>
              {translations.followings}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Fragment>
  );
}

export default React.memo(Header);
