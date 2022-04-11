import { colors } from 'colors';
import { Avatar, CustomSafeAreaView, Text, View } from 'components';
import { routeNames } from 'enums';
import moment from 'moment';
import React, { useContext, useEffect } from 'react';
import { FlatList, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { LocalizationContext } from 'services';
import { userActions } from 'store/user';

const Chats = ({ navigation }) => {
    const { translations } = useContext(LocalizationContext)
    const dispatch = useDispatch();
    const { chatList, chatListLoading } = useSelector(state => state.user);

    useEffect(() => {
        dispatch(userActions.getChatList({}))
    }, [])

    const renderItem = ({ item, index }) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate(routeNames.chat, { room: item.room_id, username: item.user.username, avatar: item.user.avatar })} style={{ borderBottomWidth: 1, paddingVertical: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', borderBottomColor: colors.lightGrey }}>
                <Avatar user={item?.user} style={{ width: 50, height: 50 }} />
                <View mLeft={10} flex>
                    <View row centered sBetween>
                        <Text size={16} medium>{item?.user?.first_name}</Text>
                        {/* <Text color={colors.grey} size={12}>{moment(item?.updatedAt).format('HH:MM')}</Text> */}
                    </View>
                    <Text mTop={2} color={colors.grey}>fsdfsf</Text>
                </View>
            </TouchableOpacity>
        )
    }


    return (
        <View flex style={{ backgroundColor: colors.white }}>
            <CustomSafeAreaView style={{ borderBottomWidth: 1, borderBottomColor: colors.lightGrey, paddingBottom: 15 }}>
                <Text bold size={18} center>{translations.chats}</Text>
            </CustomSafeAreaView>
            <FlatList
                onRefresh={() => dispatch(userActions.getChatList({}))}
                refreshing={chatListLoading}
                renderItem={renderItem}
                data={chatList}
            />
        </View>
    )
}

export default Chats;