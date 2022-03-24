import React from 'react';
import {useDispatch, useSelector} from 'react-redux';

import {routeNames} from 'enums';
import {CodeVerify} from 'layouts';
import {authActions} from 'store/auth';

const VerificationPasswordCode = props => {
  const {loading, verificationForgotPasswordError} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  let {email} = props.route.params;

  const setError = error => {
    dispatch(authActions.setErrorVerificationForgotPassword(error));
  };

  const sendCode = data => {
    dispatch(
      authActions.verificationForgotPasswordRequest(data, {
        route: routeNames.passwordRecovery,
        params: {email: email.toLowerCase().trim()},
      }),
    );
  };

  const resendCode = data => {
    dispatch(authActions.resendCode(data));
  };

  return (
    <CodeVerify
      email={email}
      navigation={props.navigation}
      resendCode={resendCode}
      sendCode={sendCode}
      setError={setError}
      codeError={verificationForgotPasswordError}
      codeLoading={loading}
    />
  );
};

export default VerificationPasswordCode;
