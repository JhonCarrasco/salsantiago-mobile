import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { LogBox } from 'react-native';
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'



import LoginScreen from './src/screens/login/Login'
import AuthLoading from './src/screens/AuthLoading'


import TabNavigatorScreen from './src/navigations/TabNavigatorScreen'

LogBox.ignoreLogs([
    'ListItem.', 
    'Animated: `useNativeDriver` was not specified.',
    `Can't perform a React state update on an unmounted component.`,
    `[Unhandled promise rejection: `
])

const OnBoardingNavigator = createStackNavigator({
    Login: LoginScreen
}, {
    initialRouteName: 'Login'
})


const RootStack = createStackNavigator({
    Main: TabNavigatorScreen
},{
    // mode: 'modal',
    headerMode: 'none',
}
)

const BaseStack = createSwitchNavigator({
    AuthLoading,
    OnBoarding: OnBoardingNavigator,
    Root: RootStack,
}, {
    initialRouteName: 'AuthLoading'
})


let Navigation = createAppContainer(BaseStack)

export default () => {
    return(
        
        <>
            <Navigation />
            <StatusBar style="auto" />
        </>
        
        
    )
}