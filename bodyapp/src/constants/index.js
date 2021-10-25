import {Dimensions} from 'react-native';

const dimensions = Dimensions.get('window');

export const API_URL = 'http://127.0.0.1:8080/api';

export const DEVICE_WIDTH = dimensions.width;
export const DEVICE_HEIGHT = dimensions.height;

export const DEFAULT_MARGIN_BOTTOM_MIN = 5;
export const DEFAULT_MARGIN_BOTTOM_MAX = 44;

