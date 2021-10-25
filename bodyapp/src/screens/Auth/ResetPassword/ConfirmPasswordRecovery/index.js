import React from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';

import {routeNames} from '_enums';
import {CodeVerify} from '_layouts';

const ConfirmPasswordRecovery = (props) => {
  const email = props.route.params.email;
  const {codeLoading, codeError, isCodeValid} = useSelector(state => state.user);

  return (
    <CodeVerify
      email={email}
      codeLoading={codeLoading}
      codeError={codeError}
      isCodeValid={isCodeValid}
      title={'Verification code'}
      subtitle={'You should receive a confirmation code within a few moments'}
      route={routeNames.resetPassword}
      navigation={props.navigation}
      screen={routeNames.confirmPasswordRecovery}
      btnText={'Continue'}
    />
  );
};

ConfirmPasswordRecovery.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired
};

ConfirmPasswordRecovery.defaultProps = {
  navigation: null,
  route: null
};

export default ConfirmPasswordRecovery;
