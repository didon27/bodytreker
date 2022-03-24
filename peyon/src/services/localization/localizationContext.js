import React, {createContext, useEffect, useState} from 'react';
import {storage} from 'services/storage';
import translations, {DEFAULT_LANGUAGE} from './translations';
import {APP_LANGUAGE_KEY} from 'constants';
import {mamaAxios} from 'services/api';

export const LocalizationContext = createContext({
  translations,
  setAppLanguage: () => {},
  appLanguage: DEFAULT_LANGUAGE,
  initializeAppLanguage: () => {},
});

export const LocalizationProvider = ({children}) => {
  const [appLanguage, setAppLanguage] = useState(DEFAULT_LANGUAGE);
  mamaAxios.defaults.headers.common['Accept-Language'] = appLanguage;

  useEffect(() => {
    initializeAppLanguage();
  }, []);

  const setLanguage = language => {
    translations.setLanguage(language);
    setAppLanguage(language);
    storage.save(APP_LANGUAGE_KEY, language);
  };

  const initializeAppLanguage = async () => {
    const currentLanguage = await storage.get(APP_LANGUAGE_KEY);

    if (!currentLanguage) {
      mamaAxios.defaults.headers.common['Accept-Language'] = DEFAULT_LANGUAGE;
      translations.setLanguage(DEFAULT_LANGUAGE);
    } else {
      mamaAxios.defaults.headers.common['Accept-Language'] = currentLanguage;
      translations.setLanguage(currentLanguage);
    }
  };

  return (
    <LocalizationContext.Provider
      value={{
        translations,
        setAppLanguage: setLanguage,
        appLanguage,
        initializeAppLanguage,
      }}>
      {children}
    </LocalizationContext.Provider>
  );
};
