import React, {useContext, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {activitiesActions} from 'store/activities';

import {LocalizationContext} from 'services';

import {Profile} from 'layouts';

const MyProfile = props => {
  const {user} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const {appLanguage} = useContext(LocalizationContext);
  const {myActivities} = useSelector(state => state.activities);

  useEffect(() => {
    dispatch(activitiesActions.getMyActivities({user_id: user.id}, true));
  }, [appLanguage]);

  return (
    <Profile
      myAccount
      user={user}
      activities={myActivities}
      navigation={props.navigation}
    />
  );
};

export default MyProfile;
