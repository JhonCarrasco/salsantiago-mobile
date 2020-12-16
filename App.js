import React from 'react'
import { LogBox } from 'react-native';
import { Provider } from 'react-redux'
import { createAppContainer, createSwitchNavigator } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'

import store from './src/store'

import LoginScreen from './src/screens/login/Login'
import RegisterScreen from './src/screens/Register'
import AuthLoading from './src/screens/AuthLoading'
import Modal from './src/screens/Modal'


import TabNavigatorScreen from './src/navigations/TabNavigatorScreen'

LogBox.ignoreLogs([
    'ListItem.', 
    'Animated: `useNativeDriver` was not specified.',
    `Can't perform a React state update on an unmounted component.`
])

const OnBoardingNavigator = createStackNavigator({
    Login: LoginScreen,
    Register: RegisterScreen,
}, {
    initialRouteName: 'Login'
})


const RootStack = createStackNavigator({
    Main: TabNavigatorScreen,
    Modal: Modal,
}, {
    mode: 'modal',
    headerMode: 'none',
})

const BaseStack = createSwitchNavigator({
    AuthLoading,
    OnBoarding: OnBoardingNavigator,
    Root: RootStack,
}, {
    initialRouteName: 'AuthLoading'
})

// export default createAppContainer(BaseStack)

let Navigation = createAppContainer(BaseStack)

export default () => {
    return(
        <Provider store={ store }>
            <Navigation />
        </Provider>
        
    )
}