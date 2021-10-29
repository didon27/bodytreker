import React, {useEffect, useState} from 'react';
import {TouchableOpacity, Keyboard} from 'react-native';
import PropTypes from 'prop-types';
import {useDispatch} from 'react-redux';
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell
} from 'react-native-confirmation-code-field';

import {KeyboardAvoidWrapper, Button, View, Text, Loader} from '_components';
import {userActions} from '_store/user';
import {api} from '_services/api';

import {styles} from './styles';
import {colors} from 'colors';

const CELL_COUNT = 4;

const CodeVerify = (props) => {
  const {isCodeValid, codeError, codeLoading} = props;

  const [value, setValue] = useState('');
  const [error, setError] = useState('');
  const [resendLoader, setResendLoader] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const dispatch = useDispatch();

  const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [params, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue
  });

  useEffect(() => {
    if (isCodeValid) {
      props.navigation.navigate(props.route);
    }
  }, [isCodeValid]);

  useEffect(() => {
    if (codeError) {
      setError(codeError);
    }
  }, [codeError]);

  useEffect(() => {
    if (value.length === 4) {
      Keyboard.dismiss();
      dispatch(
        userActions.checkVerificationCode({
          email: props.email.toLowerCase().trim(),
          verification_code: value
        })
      );
      if (error !== '') {
        setValue(value.slice(0, -1));
      }
      setError('');
    }
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

  const handleChangeText = (text) => {
    setValue(text);
  };

  const handleValidate = () => {
    if (value === '' || value.length !== 4) {
      setError('Please enter your verification code');
    } else {
      dispatch(
        userActions.checkVerificationCode({
          email: props.email,
          verification_code: value
        })
      );
    }
  };

  const handleResendCode = async () => {
    setResendLoader(true);
    await api.user.resendVerificationCode();
    setResendLoader(false);
    setTimeLeft(60);
  };

  return (
    <KeyboardAvoidWrapper showsVerticalScrollIndicator={false}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.container}
        onPress={() => Keyboard.dismiss()}
      >
        <View style={[styles.inner]}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.subTitle}>{props.subtitle}</Text>
          <CodeField
            ref={ref}
            {...params}
            value={value}
            onChangeText={handleChangeText}
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
                  index === 3 && {borderRightWidth: 0},
                  error !== '' && {borderRightColor: colors.errorColor}
                ]}
              >
                <Text style={styles.cellText}>
                  {symbol || (isFocused ? <Cursor /> : null)}
                </Text>
              </View>
            )}
          />
          <View
            style={[
              styles.bottomLine,
              error !== '' && {borderBottomColor: colors.errorColor}
            ]}
          />
          <TouchableOpacity
            onPress={handleResendCode}
            disabled={resendLoader || timeLeft !== 0}
          >
            {resendLoader && (
              <Loader color={colors.turquoise} style={{marginTop: 24}} />
            )}
            {timeLeft === 0 && !resendLoader && (
              <Text style={styles.resendCodeTxt}>Resend code</Text>
            )}
            {timeLeft !== 0 && (
              <Text style={styles.resetText}>
                Resend Code in {timeLeft} seconds
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View>
          {error !== '' && <Text style={styles.errorText}>{error}</Text>}
          <Button
            style={{marginBottom: 50}}
            text={'Continue'}
            onPress={handleValidate}
            loading={codeLoading}
          />
        </View>
      </TouchableOpacity>
    </KeyboardAvoidWrapper>
  );
};

CodeVerify.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string.isRequired,
  email: PropTypes.string,
  isCodeValid: PropTypes.bool,
  codeError: PropTypes.string,
  codeLoading: PropTypes.bool
};

CodeVerify.defaultProps = {
  navigation: {},
  route: null,
  title: null,
  subtitle: null,
  email: null,
  isCodeValid: false,
  codeError: '',
  codeLoading: false
};

export default CodeVerify;
