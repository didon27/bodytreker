import React, {useContext} from 'react';
import {StyleSheet} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {getFocusedRouteNameFromRoute} from '@react-navigation/native';
import {images} from 'images';
import {colors} from 'colors';
import {Text, View} from '../components/';
import Home from '../screens/Home';
import Profile from 'screens/Profile/Main';
import Icon from 'react-native-vector-icons/Ionicons';
import AddActivities from 'screens/AddActivities';
import HomeStack from './HomeStack';

const Tab = createBottomTabNavigator();

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.06,
    shadowRadius: 8,

    elevation: 17,
    borderColor: colors.outerBorder,
  },
  tabImage: {
    width: 28,
    height: 28,
    borderRadius: 16,
  },
});

const getTabBarVisibility = (route, stack, routeProps) => {
  const routeName = getFocusedRouteNameFromRoute(route);

  // console.log(routeName);
  const hideOnScreens = ['AddActivities'];

  // if (stack === 'AddActivities') {
  //   return {display: 'none'};
  // }
  if (hideOnScreens.includes(routeName)) {
    return {display: 'none'};
  } else {
    return styles.tabBar;
  }
};

function AppNavigation(props) {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({focused, color, size}) => {
          let source = 'home';

          if (route.name === 'Home') {
            source = 'home';
          }

          if (route.name === 'Profile') {
            source = 'person';
          }

          if (route.name === 'Message') {
            source = 'chatbubbles-sharp';
          }

          if (route.name === 'AddActivities') {
            source = 'ios-duplicate';
          }

          // You can return any component that you like here!
          return (
            <View style={{alignItems: 'center'}}>
              <Icon
                name={source}
                size={focused ? 30 : 26}
                color={focused ? '#4285f4' : '#c9c9c9'}
              />
            </View>
          );
        },
      })}
      // tabBarOptions={{
      //   showLabel: false,
      //   keyboardHidesTabBar: true,
      //   style: {
      //     backgroundColor: colors.white,
      //     paddingTop: 20,
      //     alignItems: 'center',
      //     justifyContent: 'center',
      //     borderTopWidth: 0.5,
      //     borderTopColor: 'rgba(68, 68, 68, 0.2)',
      //   },
      //   tabStyle: {
      //     backgroundColor: 'transparent',
      //     alignItems: 'center',
      //     justifyContent: 'center',
      //   },
      //   activeTintColor: colors.mainRed,
      //   inactiveTintColor: 'gray',
      // }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={({route}) => ({
          tabBarStyle: getTabBarVisibility(route, 'homeStack', props),
        })}
      />
      <Tab.Screen
        name="AddActivities"
        component={AddActivities}
        options={({route}) => ({
          tabBarStyle: getTabBarVisibility(route, 'AddActivities'),
        })}
      />
      <Tab.Screen
        name="Message"
        component={Profile}
        options={({route}) => ({
          tabBarStyle: getTabBarVisibility(route),
        })}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={({route}) => ({
          tabBarStyle: getTabBarVisibility(route),
        })}
      />
    </Tab.Navigator>
  );
}
export default AppNavigation;
