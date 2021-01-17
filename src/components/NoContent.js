import React from 'react'
import { View, Image } from 'react-native'

const NoContent = () => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
            <Image 
                source={ require('../../assets/img/noContent/silvestre_empty.gif') }
                resizeMode='cover'
                style={{ width: 300, height: 300 }}
            />
        </View>
    )
}

export default NoContent

