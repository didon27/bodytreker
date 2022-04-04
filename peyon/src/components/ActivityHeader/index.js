import React, { Fragment, useState } from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { SliderBox } from 'react-native-image-slider-box';
import Modal from 'react-native-modal';
import { colors } from 'colors';
import { View, Text, Button, Avatar } from 'components';
import { images } from 'images';
import { DEVICE_WIDTH } from 'constants';

import styles from './styles';
import { routeNames } from 'enums';
import { API } from 'constants';
import StarRating from 'react-native-star-rating';
import moment from 'moment';
import LinearGradient from 'react-native-linear-gradient';
import ImageViewer from 'react-native-image-zoom-viewer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { mamaAxios } from 'services/api';
import { API_URL } from 'constants';

function ActivityHeader({ activity, showUser, navigation, userId, translations, fetchData, changeData }) {
    const { user } = activity;
    const [modalVisible, setModalVisible] = useState(false);
    const [index, setIndex] = useState(0);
    const insets = useSafeAreaInsets();
    const [deleteImageVisible, setDeleteImageVisible] = useState(false);

    const deleteImageActivity = () => {
        const id = activity.activities_images[index]?.id || 0;
        let length = activity.activities_images.length;

        if (!activity.activities_images[index]?.edit) {

            mamaAxios.post(`${API_URL}/activities/delete-image-activity`, { id })
                .then(resp => {
                    if (length === 1) {
                        setModalVisible(false);
                    } else if (index === 0) {
                        setIndex(0)
                    } else {
                        setIndex(index - 1)
                    }

                    fetchData && fetchData()
                    setDeleteImageVisible(false)
                })
                .catch(error => console.log(error))
        } else {
            const id = activity.activities_images[index]?.id || 0;
            changeData(activity.activities_images.filter((el) => el.id !== id))
            if (length === 1) {
                setModalVisible(false);
            } else if (index === 0) {
                setIndex(0)
            } else {
                setIndex(index - 1)
            }

            // fetchData()
            setDeleteImageVisible(false)
        }
    }

    const renderFooter = () => {
        return (
            <View style={{ paddingBottom: insets.bottom || 16, paddingHorizontal: 16, alignItems: 'flex-end' }}>
                {activity.user.id === userId && <TouchableOpacity onPress={() => setDeleteImageVisible(true)}>
                    <Icon size={36} color={colors.white} name="trash-outline" />
                </TouchableOpacity>}
            </View>
        )
    }


    return (
        <Fragment>
            <Modal animationOut={'fadeOut'} isVisible={modalVisible} style={{ margin: 0 }}>
                <Modal isVisible={deleteImageVisible} style={{ margin: 0 }}>
                    <View flex style={{ justifyContent: 'flex-end', paddingBottom: insets.bottom || 16, paddingHorizontal: 16 }}>
                        <TouchableOpacity style={{ ...styles.modalControlButton, marginBottom: 10 }} onPress={deleteImageActivity}>
                            <Text medium size={16} color={colors.errorColor}>{translations.delete}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ ...styles.modalControlButton }} onPress={() => setDeleteImageVisible(false)}>
                            <Text medium size={16} color={colors.mainBlue}>{translations.cancel}</Text>
                        </TouchableOpacity>
                    </View>
                </Modal>
                <ImageViewer imageUrls={activity.activities_images.map(
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
                    !activity.activities_images.length && {
                        height: 160,
                        backgroundColor: colors.mainBlue,
                    }
                }>
                <SliderBox
                    sliderBoxHeight={360}
                    circleLoop
                    activeOpacity={1}
                    imageLoadingColor={colors.white}
                    inactiveSlideScale={1}
                    onCurrentImagePressed={(index) => { setIndex(index); setModalVisible(true) }}
                    paginationBoxVerticalPadding={0}
                    enableMomentum
                    images={activity.activities_images.map(
                        item => item?.edit ? ({ uri: item.url }) : (API + '/images/' + item.filename),
                    )}
                    dotStyle={{
                        width: DEVICE_WIDTH / activity.activities_images.length - 20,
                        height: 4,
                        maxWidth: 50,
                    }}
                    paginationBoxStyle={{ marginBottom: 40 }}
                    dotColor={colors.mainBlue}
                    inactiveDotColor={'white'}
                />
            </LinearGradient>
            {showUser ?
                <View style={styles.headerContainer}>
                    <TouchableOpacity
                        style={{ flexDirection: 'row' }}
                        onPress={() => navigation.push(routeNames.userProfile, { user })}>
                        <Avatar user={user} style={{ width: 50, height: 50 }} />
                        <View mLeft={10} flex>
                            <View row sBetween>
                                <Text size={16} bold style={{ flex: 1 }} numberOfLines={1}>
                                    {user.first_name + ' ' + user.last_name}
                                </Text>
                                {activity.createdAt &&
                                    <Text size={14} medium color={'grey'} mLeft={10} >
                                        {moment(activity.createdAt).fromNow()}
                                    </Text>
                                }
                            </View>
                            <Text size={14} style={{ fontWeight: '500' }} color={'grey'}>
                                @{user.username.toLowerCase()}
                            </Text>
                            {/* <View style={{width: 10}}>
              <StarRating
                starStyle={{marginHorizontal: 1, marginTop: 2}}
                disabled={false}
                maxStars={5}
                starSize={10}
                rating={user.rating}
                emptyStarColor="#A2A3A5"
                fullStarColor={'#F5B942'}
              />
            </View> */}
                        </View>
                    </TouchableOpacity>
                </View> : <View style={styles.headerContainer} ><Text bold size={18}>{translations.newPost}</Text></View>
            }
        </Fragment>
    );
}

export default React.memo(ActivityHeader);
