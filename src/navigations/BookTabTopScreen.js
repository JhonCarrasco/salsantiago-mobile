import React from 'react'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { Icon } from 'react-native-elements'


import AttendanceScreen from '../screens/book/attendance'
import RegistryScreen from '../screens/book/registry'


const BookTabTopScreen = createMaterialTopTabNavigator({
  Attendance: {
      screen: AttendanceScreen,
    },
    Registry: {
        screen: RegistryScreen,
    }
  }, { 
    initialRouteName: 'Attendance',
    defaultNavigationOptions: ({ navigation }) => ({
    
      tabBarOptions: {
        activeTintColor: navigation.state.routeName == 'Attendance' ? '#fff': '#fff',
        inactiveTintColor: '#fff',
        indicatorStyle: {
          height: null,
          top: 0,
          backgroundColor: "#0095ff",
          borderBottomColor: "#fff",
          borderBottomWidth: 5,
         },
        labelSize: {
          fontSize: 20,
        },
        labelStyle: {
          fontWeight: 'bold'
        },
        style: {        
          backgroundColor: '#1877f2',    
          marginTop: 25,
        },
        showLabel: true,
      }
    })
  })

export default BookTabTopScreen