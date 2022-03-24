import LocalizedStrings from 'react-native-localization';

import {ua} from './strings/ua';
import {ru} from './strings/ru';
import {en} from './strings/en';

export const DEFAULT_LANGUAGE = 'ua';

const translations = {
  ua,
  ru,
  en,
};

export default new LocalizedStrings(translations);
