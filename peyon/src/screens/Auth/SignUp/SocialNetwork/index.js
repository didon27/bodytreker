import React, { useContext, useEffect, useState } from 'react';
import { Image, KeyboardAvoidingView, StatusBar, TextInput, ImageBackground, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import { LocalizationContext } from 'services';
import { Button, Text, View, CustomSafeAreaView } from 'components';
import { images } from 'images';
import { authActions } from 'store/auth';
import Header from '../../components/Header';
import { colors } from 'colors';

import styles from './styles';
import { storage } from 'services/storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const SocialNetwork = props => {
    const { translations } = useContext(LocalizationContext);
    const {
        email,
        username,
        password,
        first_name,
        last_name,
        fcm_token
    } = props.route.params;
    const { loading } = useSelector(state => state.auth);
    const [telegram, setTelegram] = useState('');
    const [instagram, setInstagram] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();



    const signUp = async () => {
        if (!telegram.length && !instagram.length) {
            setError('')
        }

        dispatch(
            authActions.continueRegisterRequest({
                email,
                telegram,
                instagram,
                username,
                password,
                first_name,
                last_name,
                fcm_token
            }),
        );
    };

    return (
        <KeyboardAvoidingView behavior="padding">
            <StatusBar barStyle="light-content" />
            <Header navigation={props.navigation} />
            <Image
                resizeMode="cover"
                blurRadius={20}
                style={styles.background}
                source={images.startBackground}
            />
            <View style={styles.dimmer} />
            <View style={styles.centerContainer}>
                <View style={styles.centerBlock}>
                    <Text color={colors.white} size={28}>
                        {translations.signUp}
                    </Text>
                    <Text color={colors.lightGrey} size={16} mTop={10} mBottom={10}>
                        {translations.addSocialNetworks}
                    </Text>
                    <View row centered style={styles.textInputContainer}>
                        <Icon size={22} color={'grey'} name="at" />
                        <TextInput
                            style={styles.textInput}
                            value={instagram}
                            placeholderTextColor={'#adadad'}
                            placeholder={'Instagram'}
                            onChangeText={(text)  => setInstagram(text.toLocaleLowerCase())}
                        />
                    </View>
                    <View row centered style={styles.textInputContainer}>
                        <Icon size={22} color={'grey'} name="at" />
                        <TextInput
                            style={styles.textInput}
                            value={telegram}
                            placeholderTextColor={'#adadad'}
                            placeholder={'Telegram'}
                            onChangeText={(text)  => setTelegram(text.toLocaleLowerCase())}
                        />
                    </View>
                    <Button
                        text={translations.continue}
                        onPress={signUp}
                        loading={loading}
                    />
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default SocialNetwork;
