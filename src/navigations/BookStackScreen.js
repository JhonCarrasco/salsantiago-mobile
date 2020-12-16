import { createStackNavigator } from 'react-navigation-stack'

import HomeScreen from '../screens/home/Home'
import Home2Screen from '../screens/home/Home2'

const BookStackScreen = createStackNavigator({
    Home: {
        screen: HomeScreen,
    },
    Home2: {
        screen: Home2Screen,
    }
}, {
    initialRouteName: 'Home'
})

export default BookStackScreen