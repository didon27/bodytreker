import React, {createContext, useState} from 'react';
import {storage} from 'services/storage';
import translations, {DEFAULT_LANGUAGE} from './translations';
import {APP_LANGUAGE_KEY} from 'constants';

export const LocalizationContext = createContext({
  translations,
  setAppLanguage: () => {},
  appLanguage: DEFAULT_LANGUAGE,
  initializeAppLanguage: () => {},
});

export const LocalizationProvider = ({children}) => {
  const [appLanguage, setAppLanguage] = useState(DEFAULT_LANGUAGE);

  const setLanguage = language => {
    translations.setLanguage(language);
    setAppLanguage(language);
    storage.save(APP_LANGUAGE_KEY, language);
  };

  const initializeAppLanguage = async () => {
    const currentLanguage = await storage.get(APP_LANGUAGE_KEY);

    if (!currentLanguage) {
      setLanguage(DEFAULT_LANGUAGE);
    } else {
      setLanguage(currentLanguage);
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
