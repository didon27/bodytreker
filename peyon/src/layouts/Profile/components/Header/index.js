import React, { Fragment, useState } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';

import { colors } from 'colors';
import { View, Text, Button, SubscribeButton } from 'components';
import { images } from 'images';
import { DEVICE_WIDTH } from 'constants';
import Modal from 'react-native-modal'
import styles from './styles';
import { routeNames } from 'enums';
import { API } from 'constants';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ImageViewer from 'react-native-image-zoom-viewer';
import { mamaAxios } from 'services/api';
import { useDispatch, useSelector } from 'react-redux';
import { userActions } from 'store/user';
import { API_URL } from 'constants';

function Header({
  translations,
  myAccount,
  user,
  navigation,
  headerButtonLoading,
  headerButtonControl,
  fetchData,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [index, setIndex] = useState(0);
  const { token } = useSelector(state => state.auth);
  const insets = useSafeAreaInsets();
  const [deleteImageVisible, setDeleteImageVisible] = useState(false);
  const dispatch = useDispatch();

  const renderFooter = () => {
    if (myAccount) {
      return (
        <View style={{ paddingBottom: insets.bottom || 16, paddingHorizontal: 16, alignItems: 'flex-end' }}>
          <TouchableOpacity onPress={() => setDeleteImageVisible(true)}>
            <Icon size={36} color={colors.white} name="trash-outline" />
          </TouchableOpacity>
        </View>
      )
    } else {
      return null;
    }
  }


  const deleteImage = () => {
    const id = user.images[index].id;
    let length = user.images.length;


    mamaAxios.post(`${API_URL}/user/delete-user-image`, { id })
      .then(resp => {
        if (length === 1) {
          setModalVisible(false);
        } else if (index === 0) {
          setIndex(0)
        } else {
          setIndex(index - 1)
        }

        dispatch(userActions.fetch(token))
        setDeleteImageVisible(false)
      })
      .catch(error => console.log(error))
  }

  return (
    <Fragment>
      <Modal animationOut={'fadeOut'} isVisible={modalVisible} style={{ margin: 0 }}>
        <Modal isVisible={deleteImageVisible} style={{ margin: 0 }}>
          <View flex style={{ justifyContent: 'flex-end', paddingBottom: insets.bottom || 16, paddingHorizontal: 16 }}>
            <TouchableOpacity style={{ ...styles.modalControlButton, marginBottom: 10 }} onPress={deleteImage}>
              <Text medium size={16} color={colors.errorColor}>{translations.delete}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ ...styles.modalControlButton }} onPress={() => setDeleteImageVisible(false)}>
              <Text medium size={16} color={colors.mainBlue}>{translations.cancel}</Text>
            </TouchableOpacity>
          </View>
        </Modal>
        <ImageViewer imageUrls={user.images.map(
          item => item?.edit ? ({ url: item.url }) : ({ url: API + '/images/' + item.filename }),
        )}
          loadingRender={() => <ActivityIndicator size={'large'} color={colors.mainBlue} />}
          onChange={(index) => setIndex(index)}
          footerContainerStyle={{ width: '100%' }}
          enablePreload
          index={index}
          enableSwipeDown
          onSwipeDown={() => setModalVisible(false)}
          renderFooter={renderFooter}
        />
      </Modal>
      <LinearGradient
        colors={['#4285f4', '#4285f4']}
        style={
          !user.images.length && { height: 160, backgroundColor: colors.mainBlue }
        }>
        <SliderBox
          sliderBoxHeight={360}
          circleLoop
          onCurrentImagePressed={(index) => { setIndex(index); setModalVisible(true) }}
          imageLoadingColor={colors.white}
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
              <Text size={18} bold numberOfLines={1} mRight={8}>
                {user.first_name + ' ' + user.last_name}
              </Text>
              {user.verified_account && <Icon name="md-checkmark-circle" size={16} color={colors.mainBlue} />}
            </View>
            <Text color={'grey'}>
              @{user.username.toLocaleLowerCase()}
            </Text>
          </View>
          {/* <SubscribeButton
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
          /> */}
        </View>
        <View row style={{ paddingHorizontal: 16, marginBottom: 16 }}>
          {!myAccount &&
            <TouchableOpacity
              onPress={() => navigation.navigate(routeNames.chat, { room: user?.chat_room?.room_id, user_to: user, fetchUser: fetchData })}
              style={{ borderWidth: 1, borderColor: colors.lightGrey, borderRadius: 8, alignItems: 'center', justifyContent: "center", flex: 1, marginRight: 10 }} >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                }}>{translations.messages}</Text>
            </TouchableOpacity>
          }
          <SubscribeButton
            style={{ flex: 1 }}
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
