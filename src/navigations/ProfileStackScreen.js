import { createStackNavigator } from 'react-navigation-stack'

import ProfileScreen from '../screens/profile/Profile'


const ProfileStackScreen = createStackNavigator({
    Profile: {
        screen: ProfileScreen,
    },
}, {
    initialRouteName: 'Profile'
})

export default ProfileStackScreen