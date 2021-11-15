import React, {useContext, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {routeNames} from 'enums';
import {SendEmail} from 'layouts';
import {authActions} from 'store/auth';
import {LocalizationContext} from 'services';

const ForgotPassword = ({navigation}) => {
  const {translations} = useContext(LocalizationContext);
  const dispatch = useDispatch();
  const {loading, forgotPasswordError} = useSelector(state => state.auth);
  const [email, setEmail] = useState('');

  const sendServer = () => {
    dispatch(
      authActions.forgotPasswordRequest(
        {
          email: email,
        },
        {
          route: routeNames.forgotPasswordCode,
          params: {email: email.toLowerCase().trim()},
        },
      ),
    );
  };

  return (
    <SendEmail
      title={translations.forgotPassword}
      subtitle={translations.enter_your_email}
      error={forgotPasswordError}
      email={email}
      navigation={navigation}
      buttonText={translations.continue}
      loading={loading}
      setEmail={setEmail}
      sendServer={sendServer}
      setError={error => dispatch(authActions.setErrorForgotPassword(error))}
    />
  );
};

export default ForgotPassword;
