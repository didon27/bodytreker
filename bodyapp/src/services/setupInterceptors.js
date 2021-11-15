import {authActions} from 'store/auth';
import {mamaAxios} from './api';
import {storage} from './storage';

const setup = store => {
  mamaAxios.interceptors.request.use(
    config => {
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );
  const {dispatch} = store;

  mamaAxios.interceptors.response.use(
    res => {
      return res;
    },
    async err => {
      const originalConfig = err.config;

      if (
        originalConfig.url !== '/auth/signin' &&
        err.response.status === 401
      ) {
        dispatch(
          authActions.refreshToken({
            refreshToken: await storage.get('RefreshToken'),
          }),
        );
      }

      return Promise.reject(err);
    },
  );
};

export default setup;
