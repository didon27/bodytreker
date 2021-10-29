import React from 'react';
import {Dimensions, Image} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import {
  getFocusedRouteNameFromRoute,
  StackActions,
} from '@react-navigation/native';
import {images} from 'images';
import {colors} from 'colors';
import {Text, View} from '../components/';
import Home from '../screens/Home';
import Profile from 'screens/Profile/Main';
import Icon from 'react-native-vector-icons/Ionicons';

const windowHeight = Dimensions.get('window').height;

const Tab = createBottomTabNavigator();

const MenuStack = createStackNavigator();

const getTabBarVisibility = route => {
  const routeName = getFocusedRouteNameFromRoute(route);
  const hideOnScreens = ['Camera'];
  if (hideOnScreens.indexOf(routeName) > -1) return false;
  return true;
};

function MenuStackScreen() {
  return (
    <MenuStack.Navigator
      screenOptions={({navigation, route}) => ({
        headerTitleStyle: {
          fontSize: 24,
          color: colors.text,
        },
        headerStyle: {
          backgroundColor: colors.primary,
          shadowColor: 'transparent',
        },
      })}>
      <MenuStack.Screen
        name="Home"
        options={({navigation, route}) => ({
          headerShown: false,
        })}
        component={Home}
      />
    </MenuStack.Navigator>
  );
}

const tabPressListener = props => {
  const {navigation} = props;
  return {
    blur: e => {
      const target = e.target;
      const state = navigation.dangerouslyGetState();
      const route = state.routes.find(r => r.key === target);
      // If we are leaving a tab that has its own stack navigation, then clear it
      if (route.state?.type === 'stack' && route.state.routes?.length > 1) {
        navigation.dispatch(StackActions.popToTop());
      }
    },
    // Log the state for debug only
    state: e => {
      const state = navigation.dangerouslyGetState();
    },
  };
};

function AppNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
          let source = 'home';

          if (route.name === 'Home') {
            source = 'home';
          }

          if (route.name === 'Profile') {
            source = 'person';
          }

          if (route.name === 'Messenger') {
            source = 'home';
          }

          if (route.name === 'Menu') {
            source = 'home';
          }

          // You can return any component that you like here!
          return (
            <View style={{alignItems: 'center'}}>
              <Icon
                name={source}
                size={24}
                color={focused ? '#4285f4' : '#c9c9c9'}
              />
              <Text
                style={{
                  color: focused ? '#4285f4' : '#c9c9c9',
                  marginTop: 8,
                  fontSize: 12,
                  fontWeight: '400',
                }}>
                {route.name}
              </Text>
            </View>
          );
        },
      })}
      tabBarOptions={{
        showLabel: false,
        keyboardHidesTabBar: true,
        style: {
          backgroundColor: colors.white,
          paddingTop: 20,
          alignItems: 'center',
          justifyContent: 'center',
          borderTopWidth: 0.5,
          borderTopColor: 'rgba(68, 68, 68, 0.2)',
        },
        tabStyle: {
          backgroundColor: 'transparent',
          alignItems: 'center',
          justifyContent: 'center',
        },
        activeTintColor: colors.mainRed,
        inactiveTintColor: 'gray',
      }}>
      <Tab.Screen
        name="Home"
        component={MenuStackScreen}
        options={({route}) => ({
          tabBarVisible: getTabBarVisibility(route),
        })}
        listeners={props => tabPressListener({...props})}
      />
      <Tab.Screen
        name="Message"
        component={Profile}
        options={({route}) => ({
          tabBarVisible: getTabBarVisibility(route),
        })}
        listeners={props => tabPressListener({...props})}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={({route}) => ({
          tabBarVisible: getTabBarVisibility(route),
        })}
        listeners={props => tabPressListener({...props})}
      />
    </Tab.Navigator>
  );
}
export default AppNavigation;
