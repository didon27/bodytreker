import React, {useContext, useEffect, useState} from 'react';
import {useSelector, useDispatch} from 'react-redux';

import {activitiesActions} from 'store/activities';

import {LocalizationContext} from 'services';

import {Profile} from 'layouts';
import axios from 'axios';
import {API_URL} from 'constants';
import {routeNames} from 'enums';
import {userActions} from 'store/user';

const UserProfile = props => {
  const {params} = props.route;
  const [user, setUser] = useState({
    ...params.user,
    images: [{filename: params.user.avatar}],
  });
  const dispatch = useDispatch();
  const {appLanguage} = useContext(LocalizationContext);
  const {myActivities} = useSelector(state => state.activities);
  const {token} = useSelector(state => state.auth);
  const {subscribeUserLoading} = useSelector(state => state.user);
  const myUser = useSelector(state => state.user.user);
  const myAccount = user.id === myUser.id;

  const fetchData = () => {
    axios({
      method: 'post',
      url: `${API_URL}/user/get-user`,
      data: {user_id: params.user.id},
      headers: {
        'accept-language': appLanguage,
        Authorization: token,
      },
    })
      .then(response => {
        setUser(response.data);
      })
      .catch(err => {
        console.log('error', err.response.data);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  //   useEffect(() => {
  //     dispatch(activitiesActions.getMyActivities({user_id: user.id}, true));
  //   }, [appLanguage]);

  const headerButtonControl = () => {
    if (myAccount) {
      props.navigation.navigate(routeNames.editProfile);
    } else if (user?.subscribe) {
      dispatch(
        userActions.unsubscribeUser(
          {
            first_user_id: myUser.id,
            second_user_id: user.id,
          },
          fetchData,
        ),
      );
    } else {
      dispatch(
        userActions.subscribeUser(
          {
            first_user_id: myUser.id,
            second_user_id: user.id,
          },
          fetchData,
        ),
      );
    }
  };

  return (
    <Profile
      myAccount={myAccount}
      user={user}
      headerButtonLoading={subscribeUserLoading}
      headerButtonControl={headerButtonControl}
      activities={myActivities}
      navigation={props.navigation}
    />
  );
};

export default UserProfile;
