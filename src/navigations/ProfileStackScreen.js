import { createStackNavigator } from 'react-navigation-stack'

import ProfileScreen from '../screens/profile/Profile'


const ProfileStackScreen = createStackNavigator({
    Profile: {
        screen: ProfileScreen,
    },
    // Home2: {
    //     screen: Home2Screen,
    // }
}, {
    initialRouteName: 'Profile'
})

export default ProfileStackScreen