import axios from 'axios';
import SInfo from 'react-native-sensitive-info';
import RNRestart from 'react-native-restart';

import {keys} from '_enums';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

const API = axios.create({
  timeout: 60000,
  headers
});

API.interceptors.request.use(
  async (config) => {
    const token = await SInfo.getItem(keys.JWT_TOKEN, {});
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  (response) => successHandler(response),
  (error) => errorHandler(error)
);

const errorHandler = (error) => {
  if (error && error.response && error.response.status === 401) {
    forceLogout();

    return Promise.reject({...error});
  }
  return Promise.reject(error);
};

const successHandler = (response) => {
  return response;
};

const requestHandler = (request) => {
  return request;
};

export const forceLogout = async () => {
  await SInfo.deleteItem(keys.JWT_TOKEN, {});
  RNRestart.Restart();
};

export default API;
