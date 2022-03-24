import * as React from 'react';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox, StatusBar } from 'react-native';
import { Provider } from 'react-redux';

import Navigation, { navigationRef } from './navigation';
import { store } from 'store/configureStore';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import setupInterceptors from './services/setupInterceptors';
import { LocalizationProvider } from 'services';
import { SafeAreaProvider } from 'react-native-safe-area-context';

function App() {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content', true);
  }, []);

  return (
    <SafeAreaProvider>
      <Provider store={store}>
        <LocalizationProvider>
          <StatusBar translucent backgroundColor={'transparent'} />
          <NavigationContainer ref={navigationRef}>
            <BottomSheetModalProvider>
              <Navigation />
            </BottomSheetModalProvider>
          </NavigationContainer>
        </LocalizationProvider>
      </Provider>
    </SafeAreaProvider>
  );
}

setupInterceptors(store);

export default App;
