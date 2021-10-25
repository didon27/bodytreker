import * as React from 'react';
import {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {LogBox, StatusBar} from 'react-native';
import {Provider} from 'react-redux';

import Navigation, {navigationRef} from './navigation';
import {store} from '_store/configureStore';

function App() {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state'
  ]);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content', true);
  }, []);

  return (
    <Provider store={store}>
      <StatusBar translucent backgroundColor={'transparent'} />
      <NavigationContainer ref={navigationRef}>
        <Navigation />
      </NavigationContainer>
    </Provider>
  );
}

export default App;
