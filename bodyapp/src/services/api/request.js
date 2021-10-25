import axios from 'axios';

import {API_URL} from '_constants';

export const mamaAxios = axios.create({
  baseURL: API_URL
});

export const request = {
  get: (path, params = {}) => mamaAxios.get(path, params),
  post: (path, params = {}) => mamaAxios.post(path, params),
  put: (path, params = {}) => mamaAxios.put(path, params),
  patch: (path, params = {}) => mamaAxios.patch(path, params),
  delete: (path, params = {}) => mamaAxios.delete(path, {data: params})
};
