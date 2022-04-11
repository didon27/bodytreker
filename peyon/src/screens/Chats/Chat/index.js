import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Image, Platform, TextInput, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { GiftedChat } from 'react-native-gifted-chat'
import emojiUtils from 'emoji-utils'

import SlackMessage from './SlackMessage'
import { Avatar, CustomSafeAreaView, Text, View } from 'components'
import Icon from 'react-native-vector-icons/FontAwesome';
import { LocalizationContext } from 'services'
import { io } from "socket.io-client";
import { API } from 'constants'
import SlackBubble from './SlackBubble'
import { useSelector } from 'react-redux'
import { colors } from 'colors'
import { mamaAxios } from 'services/api'
import { API_URL } from 'constants'


const Chat = ({ navigation, route }) => {
    const { translations } = useContext(LocalizationContext)
    const [messages, setMessages] = useState([]);
    const { user } = useSelector(state => state.user);
    const { room, username } = route.params;
    const socket = io(
        `https://peyon.com.ua`,
        {
            transports: ['websocket'], // you need to explicitly tell it to use websockets
        },
    );

    // console.log(messages)

    useEffect(() => {
        socket.on("receive_message", (data) => {
            console.log('fsdfsd', data)
            setMessages(previousMessages => GiftedChat.append(previousMessages, {
                _id: new Date(),
                text: data.message,
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: data.author,
                    avatar: 'https://placeimg.com/140/140/any',
                },
            }))
        });
    }, [socket]);

    useEffect(() => {

        socket.emit("join_room", room);

        socket.on('connect', () => {
            console.log('connected --------------- socket ---------------');
        });

        socket.on('connect_error', err => {
            console.log(err);
        });

        return () => socket.disconnect();
    }, [])

    useEffect(() => {
        mamaAxios.post(API_URL + '/chat/get-chat-messages', { room_id: room }).then((response) => {


            setMessages(
                response.data.map((el) => (
                    {
                        _id: el.id,
                        text: el.message,
                        createdAt: el.createdAt,
                        user: {
                            _id: el.user.id,
                            name: `${el.user.first_name}`,
                            avatar: API + '/images/' + el.user.avatar,
                        },
                    }
                ))
            );
        })
    }, [room])

    const onSend = useCallback(async (messages = []) => {
        // console.log(messages);
        let messageContent = {
            room: room,
            user_id: user.id,
            content: {
                author: user.username,
                message: messages[0].text,
            },
        };

        await socket.emit("send_message", messageContent);

        setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    }, [])

    const renderMessage = (props) => {
        const {
            currentMessage: { text: currText },
        } = props

        let messageTextStyle

        // Make "pure emoji" messages much bigger than plain text.
        if (currText && emojiUtils.isPureEmojiString(currText)) {
            messageTextStyle = {
                fontSize: 28,
                // Emoji get clipped if lineHeight isn't increased; make it consistent across platforms.
                lineHeight: Platform.OS === 'android' ? 34 : 30,
            }
        }

        return <SlackMessage  {...props} messageTextStyle={messageTextStyle} />
    }

    // const renderInputToolbar = () => {
    //     return (
    //         <View style={{ paddingHorizontal: 16, flex: 1, paddingTop: 16, justifyContent: 'center', borderTopWidth: 1, borderTopColor: colors.lightGrey }}>
    //             <TextInput
    //                 placeholder={translations.messages + "..."}
    //                 multiline
    //                 style={{ borderWidth: 1, fontSize: 16, borderRadius: 8, paddingHorizontal: 8, minHeight: 40 }}
    //                 placeholderTextColor={'grey'}
    //             />
    //         </View>
    //     )
    // }

    return (
        <View flex style={{ backgroundColor: 'white' }}>
            <CustomSafeAreaView style={{ paddingHorizontal: 16, borderBottomWidth: 1, paddingBottom: 16, borderBottomColor: colors.lightGrey }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 0 }}>
                        <Icon name="angle-left" size={30} color={'#585858'} />
                    </TouchableOpacity>
                    <Text bold size={18}>{username}</Text>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', right: 0 }}>
                        <Avatar
                            user={user}
                            letterStyle={{ fontSize: 36 }}
                            style={{ width: 36, height: 36, borderRadius: 20}}
                        />
                    </TouchableOpacity>
                </View>
            </CustomSafeAreaView>
            <GiftedChat
                renderAvatar={null}
                // renderBubble={(props) => <SlackBubble {...props} />}
                messages={messages}
                placeholder={translations.messages + "..."}
                onSend={messages => onSend(messages)}
                user={{
                    _id: user.id,
                }}
            // renderMessage={renderMessage}
            />
        </View>
    )
}

export default Chat;