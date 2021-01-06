import React from 'react'
import { View, Image } from 'react-native'

const NotFound = () => {
    return (
        <View style={{ flex: 1, alignItems: 'center', }}>
            <Image 
                source={ require('../../assets/img/no-result-found.png') }
                resizeMode='cover'
                style={{ width: 200, height: 200 }}
            />
        </View>
    )
}

export default NotFound

