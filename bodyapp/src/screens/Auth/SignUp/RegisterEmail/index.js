import { routeNames } from 'enums';
import {CodeVerify} from 'layouts';
import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {authActions} from 'store/auth';

const RegisterEmail = props => {
  const {loading, errorRegisterCode} = useSelector(state => state.auth);
  const dispatch = useDispatch();
  let {email} = props.route.params;

  const setError = error => {
    dispatch(authActions.setErrorRegisterCode(error));
  };

  const sendCode = data => {
    dispatch(
      authActions.verificationEmailRequest(data, {
        route: routeNames.continueRegister,
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
      codeError={errorRegisterCode}
      codeLoading={loading}
    />
  );
};

export default RegisterEmail;
