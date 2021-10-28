import React, {useState} from 'react';
import {View, ScrollView, Keyboard, Text} from 'react-native';
import {useSelector} from 'react-redux';

import {colors} from 'colors';
import {Button, TextInput, KeyboardAvoidWrapper} from '_components';
import {fieldValidator} from '_services/validator';
import {api, mamaAxios} from '_services/api';
import Modal from 'react-native-modal';
import styles from './styles';

const ResetPassword = (props) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const {tempToken} = useSelector((state) => state.user);
  const {values, errors, handleChange, handleSubmit} = fieldValidator(
    handleGoNext,
    'resetNewPasswords'
  );

  async function handleGoNext() {
    setLoading(true);
    mamaAxios.defaults.headers.common.Authorization = `Bearer ${ tempToken }`;

    // const response = await api.auth.resetNew({
    //   new_password: values.password,
    //   new_password_confirmation: values.repeatPassword
    // });

    const response = await api.auth
      .resetNew({
        new_password: values.password,
        new_password_confirmation: values.repeatPassword
      })
      .then((res) => setModalVisible(true))
      .catch((err) => setError(err.response.data.error));

    delete mamaAxios.defaults.headers.common.Authorization;
    setLoading(false);

  }

  return (
    <>
      <Modal isVisible={modalVisible}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTxt}>
            Your password was successfully changed!
          </Text>
          <Button
            text="OK"
            style={{height: 40}}
            onPress={() => {
              setModalVisible(false);
              props.navigation.navigate('Start');
            }}
          />
        </View>
      </Modal>
      <KeyboardAvoidWrapper>
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inner}>
            <Text style={styles.title}>Password recovery</Text>
            <Text style={styles.subtitle}>Please enter a new password.</Text>
            <View mTop={32}>
              <TextInput
                isPassword
                isPasswordIconRed={errors.password}
                blurOnSubmit={false}
                onSubmitEditing={() => Keyboard.dismiss()}
                placeholder={'Password'}
                value={values.password}
                error={errors.password}
                containerStyle={{marginBottom: 25}}
                placeholderTextColor={colors.grey}
                onChangeText={(text) => handleChange('password', text)}
              />
              <TextInput
                isPassword
                isPasswordIconRed={errors.repeatPassword}
                blurOnSubmit={false}
                onSubmitEditing={() => Keyboard.dismiss()}
                placeholder={'Password again'}
                value={values.repeatPassword}
                error={errors.repeatPassword}
                placeholderTextColor={colors.grey}
                containerStyle={{marginBottom: 20}}
                onChangeText={(text) => handleChange('repeatPassword', text)}
              />
            </View>
          </View>
        </ScrollView>
        <View style={{paddingBottom: 35, marginHorizontal: 16}}>
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <Button
            text={'Continue'}
            onPress={handleSubmit}
            disabled={loading}
            loading={loading}
          />
        </View>
      </KeyboardAvoidWrapper>
    </>
  );
};

export default ResetPassword;
