import React from 'react';
import {View, ScrollView} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {colors} from '_colors';
import {routeNames} from '_enums';
import {Button, Text, TextInput, KeyboardAvoidWrapper} from '_components';
import {authActions} from '_store/auth';
import {fieldValidator} from '_services/validator';
import {replaceText} from '_helpers';

import styles from './styles';

const ResetPassword = props => {
  const {resetPasswordError, resetPasswordLoading} = useSelector(state => state.auth);
  const {values, errors, handleChange, handleSubmit} = fieldValidator(handleReset, 'reset');
  const dispatch = useDispatch();

  function handleReset() {
    dispatch(authActions.resetPasswordRequest({email: values.email}, {route: routeNames.confirmPasswordRecovery, params: {email: values.email}}));
  }

  return (
    <KeyboardAvoidWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.inner}>
          <Text style={styles.title}>Password recovery</Text>
          <Text style={styles.subtitle}>
            Please fill in an email you used on registration.
            We’ll send you a confirmation code.
          </Text>
          <View mTop={32}>
            <TextInput
              autoCapitalize={'none'}
              placeholder={'Email'}
              value={replaceText(values.email)}
              error={errors.email}
              placeholderTextColor={colors.grey}
              onChangeText={text => handleChange('email', replaceText(text))}
            />
          </View>
        </View>
      </ScrollView>
      <View style={{paddingBottom: 35, marginHorizontal: 16}}>
        {resetPasswordError && <Text style={styles.errorText}>{resetPasswordError}</Text>}
        <Button
          text={'Continue'}
          onPress={handleSubmit}
          loading={resetPasswordLoading}
          disabled={resetPasswordLoading}
        />
      </View>
    </KeyboardAvoidWrapper>
  );
};

export default ResetPassword;
