import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Image, KeyboardAvoidingView, Platform, TextInput, TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { GiftedChat, InputToolbar, Send } from 'react-native-gifted-chat'
import emojiUtils from 'emoji-utils'

import SlackMessage from './SlackMessage'
import { Avatar, CustomSafeAreaView, Text, View } from 'components'
import Icon from 'react-native-vector-icons/FontAwesome';
import IconIonicons from 'react-native-vector-icons/Ionicons';
import { LocalizationContext } from 'services'
import { io } from "socket.io-client";
import { API } from 'constants'

import { useSelector } from 'react-redux'
import { colors } from 'colors'
import { mamaAxios } from 'services/api'
import { API_URL } from 'constants'
import { routeNames } from 'enums'
import moment from 'moment'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { TypingAnimation } from "react-native-typing-animation";

const Chat = ({ navigation, route }) => {
    const { translations } = useContext(LocalizationContext)
    const [messages, setMessages] = useState([]);
    const { user } = useSelector(state => state.user);
    const { user_to, fetchUser } = route.params;
    const [room, setRoom] = useState(route.params.room);
    const { appLanguage } = useContext(LocalizationContext)
    const [typing, setTyping] = useState(null);
    const [online, setOnlineStatus] = useState(false);
    const insets = useSafeAreaInsets();
    const socket = io(
        `https://peyon.com.ua`,
        {
            transports: ['websocket'], // you need to explicitly tell it to use websockets
        },
    );

    useEffect(() => {
        setRoom(route.params.room)
    }, [route.params.room])

    useEffect(() => {
        setTimeout(() => {
            setTyping(false);
        }, 6000);
    }, [typing])

    useEffect(() => {
        socket.on("typing", (data) => {
            if (data.user_id !== user.id && data?.isTyping) {
                if (!typing) {
                    setTyping(true);
                }
            }
        })

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
        socket.emit("join_room", { room, user_id: user.id });
        socket.on('connect', (data) => {
            console.log('connected --------------- socket ---------------', data);
        });

        socket.on('offline', (data) => {
            setOnlineStatus(false);
        });

        socket.on('online', (data) => {
            console.log(data)
            setOnlineStatus(true);
        });

        socket.on('connect_error', err => {
            console.log(err);
        });

        return () => socket.disconnect();
    }, [])

    useEffect(() => {
        if (room) {
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
        }
    }, [room])

    const onSend = useCallback(async (messages = []) => {
        // console.log(messages);
        if (!room) {
            let new_room = `room_${user.id}${moment().valueOf()}`
            mamaAxios.post(API_URL + '/chat/create-chat-room', { "data": [{ "user_id": user.id, "room_id": new_room }, { "user_id": user_to.id, "room_id": new_room }] })
                .then(async (response) => {
                    setRoom(new_room);
                    fetchUser && fetchUser();
                    let messageContent = {
                        room: new_room,
                        user_id: user.id,
                        to_user_id: user_to.id,
                        content: {
                            author: user_to.username,
                            message: messages[0].text,
                        },
                    };

                    await socket.emit("send_message", messageContent);

                    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
                })
        } else {
            let messageContent = {
                room: room,
                user_id: user.id,
                to_user_id: user_to.id,
                content: {
                    author: user_to.username,
                    message: messages[0].text,
                },
            };

            await socket.emit("send_message", messageContent);

            setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
        }
    }, [room])

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

    const renderSend = (props) => (
        <Send
            {...props}
            disabled={!props.text}
            containerStyle={{
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 2,
            }}
        >
            <IconIonicons name="arrow-up-circle" size={40} color={colors.mainBlue} />
        </Send>
    );

    const renderInputToolbar = (props) => (
        <InputToolbar
            {...props}
            containerStyle={{
                // paddingTop: 6,
                backgroundColor: '#f8f7f7',
            }}
            primaryStyle={{ alignItems: 'center' }}
        />
    );


    return (
        <View flex style={{ backgroundColor: '#f8f7f7' }}>
            <CustomSafeAreaView style={{ paddingHorizontal: 16, borderBottomWidth: 1, paddingBottom: 16, borderBottomColor: colors.lightGrey, backgroundColor: 'white' }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 0 }}>
                        <Icon name="angle-left" size={30} color={'#585858'} />
                    </TouchableOpacity>
                    <View centered>
                        <Text bold size={18}>{user_to.username}</Text>
                        <Text color={online ? colors.mainGreen : 'grey'} size={12}>{online ? 'Online' : 'Offline'}</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate(routeNames.userProfile, { user: user_to })} style={{ position: 'absolute', right: 0 }}>
                        <Avatar
                            user={user_to}
                            letterStyle={{ fontSize: 36 }}
                            style={{ width: 40, height: 40, borderRadius: 20 }}
                        />
                    </TouchableOpacity>
                </View>
            </CustomSafeAreaView >
            <GiftedChat
                renderAvatar={null}
                renderInputToolbar={renderInputToolbar}
                scrollToBottom
                infiniteScroll
                renderFooter={() => typing && <View style={{
                    backgroundColor: '#f0f0f0',
                    marginLeft: 8,
                    marginBottom: 16,
                    borderRadius: 15,
                    borderBottomLeftRadius: 0,
                    width: 60,
                    padding: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={{ backgroundColor: 'red' }}>
                        <TypingAnimation
                            dotColor="grey"
                            dotMargin={8}
                            dotAmplitude={3}
                            dotSpeed={0.15}
                            dotRadius={3}
                            dotX={-3}
                            dotY={-3}
                        />
                    </View>
                </View>}
                renderSend={renderSend}
                bottomOffset={Platform.OS === "ios" && insets.bottom}
                scrollToBottomComponent={() => <Icon name="angle-down" size={26} color={'grey'} />}
                locale={appLanguage !== 'ua' ? appLanguage : 'uk'}
                textInputStyle={{ backgroundColor: 'white', borderWidth: 1, borderColor: colors.lightGrey, borderRadius: 14, paddingHorizontal: 16, paddingTop: 8, marginLeft: 10, marginRight: 10 }}
                messages={messages}
                placeholder={translations.messages + "..."}
                onSend={messages => onSend(messages)}
                onInputTextChanged={(text) => {
                    socket.emit("typing", {
                        isTyping: text.length,
                        user_id: user.id,
                        room: room
                    });
                }}
                user={{
                    _id: user.id,
                }}
            // renderMessage={renderMessage}
            />
        </View >
    )
}

export default Chat;


