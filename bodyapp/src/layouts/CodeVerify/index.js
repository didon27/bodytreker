import React, {useEffect, useState} from 'react';
import {
  TouchableOpacity,
  KeyboardAvoidingView,
  StatusBar,
  Image,
} from 'react-native';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from 'react-native-confirmation-code-field';

import {Button, View, Text, Loader} from 'components';
import Header from '../../screens/Auth/components/Header';
import {colors} from 'colors';
import {images} from 'images';

import {styles} from './styles';

const CELL_COUNT = 4;

const CodeVerify = ({
  codeError,
  codeLoading,
  setError,
  sendCode,
  resendCode,
  navigation,
  email,
}) => {
  const [value, setValue] = useState('');
  const [resendLoader, setResendLoader] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [params, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  useEffect(() => {
    setError(null);
  }, [value]);

  useEffect(() => {
    if (!timeLeft) {
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const _sendCode = () => {
    sendCode({
      email,
      activation_token: value,
    });
  };

  const handleResendCode = async () => {
    setResendLoader(true);
    resendCode({email});
    setResendLoader(false);
    setTimeLeft(60);
  };

  return (
    <KeyboardAvoidingView behavior="padding">
      <StatusBar barStyle="light-content" />
      <Header navigation={navigation} />
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
            Код подтверждения
          </Text>
          <Text color={colors.lightGrey} size={16} mTop={10} mBottom={20}>
            Введите код который пришел к вам на почту{' '}
            {email.toLowerCase().trim()}
          </Text>
          <CodeField
            ref={ref}
            {...params}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            autoFocus
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({index, symbol, isFocused}) => (
              <View
                onLayout={getCellOnLayoutHandler(index)}
                key={index}
                style={[
                  styles.cellRoot,
                  isFocused && styles.focusCell,
                  index === 3 && {marginRight: 0},
                  codeError && {borderColor: 'red'},
                ]}>
                <Text style={styles.cellText}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />
          {codeError && <Text style={styles.errorText}>{codeError}</Text>}
          <Button
            text={'Продолжить'}
            style={{marginTop: 30}}
            disabled={value.length < 4}
            onPress={_sendCode}
            loading={codeLoading}
          />
          <TouchableOpacity
            style={{marginTop: 16}}
            onPress={handleResendCode}
            disabled={resendLoader || timeLeft !== 0}>
            {resendLoader && <Loader color={colors.turquoise} />}
            {timeLeft === 0 && !resendLoader && (
              <Text style={styles.resendCodeTxt}>Отправить еще раз</Text>
            )}
            {timeLeft !== 0 && (
              <Text style={styles.resetText}>
                Resend Code in {timeLeft} seconds
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CodeVerify;
