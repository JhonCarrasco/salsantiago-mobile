import React from 'react'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { Icon } from 'react-native-elements'


import AttendanceScreen from '../screens/book/attendance'
import RegistryScreen from '../screens/book/registry'


const BookTabTopScreen = createMaterialTopTabNavigator({
  Asistencia: {
      screen: AttendanceScreen,
    },
  Registro: {
      screen: RegistryScreen,
  }
  }, { 
    initialRouteName: 'Asistencia',
    defaultNavigationOptions: ({ navigation }) => ({
    
      tabBarOptions: {
        activeTintColor: navigation.state.routeName == 'Asistencia' ? '#fff': '#fff',
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

  // BookTabTopScreen.navigationOptions = ({ navigation }) => {

  //   const { routeName } = navigation.state.routes[navigation.state.index]

  //   // You can do whatever you like here to pick the title based on the route name
  //   const headerTitle = routeName
  //   console.log(headerTitle)

  //   return {
  //   headerTitle,
  //   }

  // }

export default BookTabTopScreen