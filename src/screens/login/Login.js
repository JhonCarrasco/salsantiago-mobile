import React, { useRef } from 'react';
import { StyleSheet, ScrollView, View, Image } from 'react-native';
import { Divider } from 'react-native-elements'
import Toast from 'react-native-easy-toast'


import LoginForm from '../../components/login/LoginForm'
import LoginGoogle from '../../components/login/LoginGoogle'


export default function Login ({navigation}) {
    const toastRef = useRef()
    return (
        <ScrollView>
            <Image 
            source={require("../../../assets/img/login-salsantiago.png")}
            resizeMode="contain"
            style={ styles.logo }
            />
            <View style={ styles.viewContainer }>
                <LoginForm navigation={navigation} toastRef={ toastRef }/>
            </View>
            <Divider style={ styles.divider }/>
            <View style={ styles.viewContainer }>
                <LoginGoogle navigation={navigation} toastRef={ toastRef } />
            </View>
            <Toast ref={ toastRef } position="center" opacity={0.9} />
        </ScrollView>
    )
}



const styles = StyleSheet.create({
    logo: {
        width: "100%",
        height: 150,
        marginTop: 20,
    },
    divider: {
        backgroundColor: "#00a680",
        margin: 40,
    },
    viewContainer: {
        marginRight: 40,
        marginLeft: 40,
    },
})
