import React from 'react'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import { Icon } from 'react-native-elements'


import PlansScreen from '../screens/business/plans'
import RecordScreen from '../screens/business/record'


const BusinessTabTopScreen = createMaterialTopTabNavigator({
    Plans: {
      screen: PlansScreen,
    },
    Record: {
        screen: RecordScreen,
    }
  }, { 
    initialRouteName: 'Plans',
    defaultNavigationOptions: ({ navigation }) => ({
    
      tabBarOptions: {
        activeTintColor: navigation.state.routeName == 'Plans' ? '#fff': '#fff',
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

export default BusinessTabTopScreen