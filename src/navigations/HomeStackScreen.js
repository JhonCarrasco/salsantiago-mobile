import { createStackNavigator } from 'react-navigation-stack'

import HomeScreen from '../screens/home/home'

const HomeStackScreen = createStackNavigator({
    Home: {
        screen: HomeScreen,
    }    
}, {
    initialRouteName: 'Home',
    
})

export default HomeStackScreen