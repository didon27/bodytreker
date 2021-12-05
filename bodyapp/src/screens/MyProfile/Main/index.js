import React, {useContext, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {activitiesActions} from 'store/activities';

import {LocalizationContext} from 'services';

import {UserProfile} from 'layouts';

const Profile = props => {
  const {user} = useSelector(state => state.user);
  const dispatch = useDispatch();
  const {appLanguage} = useContext(LocalizationContext);
  const {myActivities} = useSelector(state => state.activities);

  useEffect(() => {
    dispatch(activitiesActions.getMyActivities({user_id: user.id}));
  }, [appLanguage]);

  return (
    <UserProfile
      user={user}
      activities={myActivities}
      navigation={props.navigation}
    />
  );
};

export default Profile;
