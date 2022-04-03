import React, {useContext, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {routeNames} from 'enums';
import {SendEmail} from 'layouts';
import {authActions} from 'store/auth';
import {LocalizationContext} from 'services';

const SignUp = ({navigation}) => {
  const {translations} = useContext(LocalizationContext);
  const dispatch = useDispatch();
  const {loading, errorRegister} = useSelector(state => state.auth);
  const [email, setEmail] = useState('');

  const sendServer = () => {
    dispatch(
      authActions.signUp(
        {
          email: email,
        },
        {
          route: routeNames.registerEmail,
          params: {email: email.toLowerCase().trim()},
        },
      ),
    );
  };

  return (
    <SendEmail
      error={errorRegister}
      email={email}
      register
      title={translations.signUp}
      subtitle={translations.enter_your_email}
      buttonText={translations.continue}
      navigation={navigation}
      loading={loading}
      setEmail={setEmail}
      sendServer={sendServer}
      setError={error => dispatch(authActions.setErrorRegister(error))}
    />
  );
};

export default SignUp;
