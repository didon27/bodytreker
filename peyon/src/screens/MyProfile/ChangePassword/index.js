import React, { useContext, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';

import { LocalizationContext } from 'services';
import { mamaAxios } from 'services/api';
import { Button, CustomSafeAreaView, DefaultModal, Text, TextInput, View } from 'components';
import { colors } from 'colors';
import { TouchableOpacity } from 'react-native';
import { API_URL } from 'constants';

const ChangePassword = props => {
    const { translations } = useContext(LocalizationContext);
    const { appLanguage } = useContext(LocalizationContext);
    const [password, setPassword] = useState('');
    const [confirmation_password, setConfirmationPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [old_password, setOldPassword] = useState('');
    const [errors, setErrors] = useState({});

    const changePassword = () => {

        let _errors = {};

        if (old_password.length < 6) {
            _errors.old_password = translations.minimum_six_characters;
        }


        if (password.length < 6) {
            _errors.password = translations.minimum_six_characters;
        }

        if (confirmation_password.length < 6) {
            _errors.confirmation_password = translations.minimum_six_characters;
        }

        if (confirmation_password !== password) {
            _errors.confirmation_password = translations.password_mismatch;
            _errors.password = translations.password_mismatch;
        }


        if (Object.keys(_errors).length) {
            setErrors(_errors);
            return;
        }


        mamaAxios.post(API_URL + '/user/reset-password', { password, old_password }).
            then((response) => {
                console.log(response.data);
                setPassword('');
                setConfirmationPassword('');
                setOldPassword('');
                setModalVisible(true)
                setErrors({});
            }).catch((error) => {
                setErrors(error.response.data);
                console.log('error', error.response.data)
            })
    }

    return (
        <View style={{ backgroundColor: colors.white, flex: 1 }}>
            <DefaultModal isVisble={modalVisible} setVisible={setModalVisible} text={translations.updateSuccessfully} onPress={() => setModalVisible(false)} />
            <CustomSafeAreaView style={{ paddingHorizontal: 16 }}>
                <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                    <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ position: 'absolute', left: 0 }}>
                        <Icon name="angle-left" size={30} color={'#585858'} />
                    </TouchableOpacity>
                    <Text bold size={18}>{translations.change_password}</Text>
                </View>
            </CustomSafeAreaView>
            <View mTop={24} style={{ paddingHorizontal: 16, justifyContent: 'space-between', flex: 1, paddingBottom: 20 }}>
                <View>
                    <TextInput
                        value={old_password}
                        error={errors?.old_password}
                        onChangeText={setOldPassword}
                        containerStyle={{ backgroundColor: '#f4f4f4' }}
                        placeholder={translations.oldPassword}
                        isPassword />
                    <TextInput
                        value={password}
                        error={errors?.password}
                        onChangeText={setPassword}
                        containerStyle={{ backgroundColor: '#f4f4f4' }}
                        placeholder={translations.password}
                        isPassword />
                    <TextInput
                        value={confirmation_password}
                        error={errors?.confirmation_password}
                        onChangeText={setConfirmationPassword}
                        containerStyle={{ backgroundColor: '#f4f4f4' }}
                        placeholder={translations.repeat_password}
                        isPassword />
                </View>
                <Button text={translations.change_password} onPress={changePassword} />
            </View>
        </View>
    );
};

export default ChangePassword;
