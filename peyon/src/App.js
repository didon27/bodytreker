import * as React from 'react';
import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox, Platform, StatusBar } from 'react-native';
import { Provider } from 'react-redux';

import Navigation, { navigationRef } from './navigation';
import { store } from 'store/configureStore';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import setupInterceptors from './services/setupInterceptors';
import { LocalizationProvider } from 'services';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification'
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { storage } from 'services/storage';

function App() {
  LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
  ]);

  useEffect(() => {
    StatusBar.setBarStyle('dark-content', true);
    handlePushNotification();
  }, []);

  const showNotification = (response) => {
    if (Platform.OS === 'android') {
      PushNotification.localNotification({
        channelId: "peyon-channel", // (required)
        channelName: "Peyon channel", // (required)
        title: response.notification.body, // (optional)
        message: response.notification.title, // (required)
      })
    } else {
      PushNotificationIOS.presentLocalNotification({
        alertTitle: response.notification.title,
        alertBody: response.notification.body,
        applicationIconBadgeNumber: 1,
      });
    }
  }

  const getFcmToken = () => {
    firebase
      .messaging()
      .getToken(firebase.app().options.messagingSenderId)
      .then(token => {console.log(token); storage.save('fcmToken', token)})
      .catch(e => console.log(e));
  }

  const handlePushNotification = () => {
    if (Platform.OS === 'android') {
      PushNotification.createChannel({
        channelId: "peyon-channel", // (required)
        channelName: "Peyon channel", // (required)
      },
        (created) => console.log(`CreateChannel returned '${created}'`)
      );
      getFcmToken();
      firebase.messaging().setBackgroundMessageHandler(showNotification)
      firebase.messaging().onMessage(response => showNotification(response))
    } else {
      PushNotificationIOS.requestPermissions({
        alert: true,
        badge: true,
        sound: true,
        critical: true,
      }).then(async (data) => {
        if (await firebase.messaging().hasPermission()) {
          await messaging().registerDeviceForRemoteMessages();
          await messaging().setAutoInitEnabled(true);
          getFcmToken();

          firebase.messaging().onMessage(response => showNotification(response))
        }
      },
        (data) => {
          console.log('PushNotificationIOS.requestPermissions failed', data);
        },
      );
    }
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}

setupInterceptors(store);

export default App;
