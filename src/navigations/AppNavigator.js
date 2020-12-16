import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'

import MealsScreen from '../screens/Meals'

const AppNavigator = createStackNavigator({
    Meals: {
        screen: MealsScreen,
    }
}, {
    initialRouteName: 'Meals'
})

export default AppNavigator