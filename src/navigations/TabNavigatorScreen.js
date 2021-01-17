import React from 'react'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { Icon } from 'react-native-elements'


import HomeStackScreen from './HomeStackScreen'
import BookTabTopScreen from './BookTabTopScreen'
import ProfileStackScreen from './ProfileStackScreen'
import BusinessTabTopScreen from './BusinessTabTopScreen'

import chooseIcon from '../utils/miscellaneous'

const TabScreen = createBottomTabNavigator({
    Home: {
      screen: HomeStackScreen,
    },
    Book: {
        screen: BookTabTopScreen,
    },
    Business: {
        screen: BusinessTabTopScreen,
    },
    Profile: {
      screen: ProfileStackScreen,
    }
  }, { 
    initialRouteName: 'Home',
    defaultNavigationOptions: ({ navigation }) => ({
      
      tabBarIcon: ({ focused, horizontal, tintColor}) => {
        const { routeName } = navigation.state
        let iconName = chooseIcon(routeName, focused)
        
        return <Icon type="material-community" name={ iconName } size={ 30 } />
      },
      tabBarOptions: {
        style: {        
          backgroundColor: '#0095ff',        
        },
        showLabel: false,
      },
      
    }),
    // resetOnBlur: true,
  })

export default TabScreen