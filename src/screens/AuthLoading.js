import React, { useEffect } from 'react'
import { View, ActivityIndicator, AsyncStorage } from 'react-native'

export default ({ navigation }) => {

    useEffect(() => {
        AsyncStorage.getItem('token')
        .then(x => {
            // console.log('token', x)
            navigation.navigate(x ? 'Root' : 'OnBoarding')
        })
    }, [])

    return (
        <View>
            <ActivityIndicator />
        </View>
    )
}
