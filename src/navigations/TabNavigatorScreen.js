import React from 'react'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { Icon } from 'react-native-elements'


import HomeStackScreen from './HomeStackScreen'
import BookStackScreen from './BookStackScreen'
import BusinessStackScreen from './BusinessStackScreen'
import ProfileStackScreen from './ProfileStackScreen'

import chooseIcon from '../utils/miscellaneous'

const TabScreen = createBottomTabNavigator({
    Home: {
      screen: HomeStackScreen,
    },
    Book: {
        screen: BookStackScreen,
    },
    Business: {
        screen: BusinessStackScreen,
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
        activeTintColor: navigation.state.routeName == 'Home' ? '#e91e63': 'orange',
        inactiveTintColor: 'black',
        labelSize: {
          fontSize: 16,
        },
        style: {        
          backgroundColor: '#fec',        
        },
        showLabel: false,
      }
    })
  })

export default TabScreen