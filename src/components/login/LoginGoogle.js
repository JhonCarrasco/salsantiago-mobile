import React, { useState } from 'react'
import { StyleSheet, View, Alert, Platform, AsyncStorage } from 'react-native'
import { SocialIcon } from 'react-native-elements'
import * as Google from 'expo-google-app-auth'

const LoginGoogle = ({navigation, toastRef}) => {
  const [isLoading, setIsLoading] = useState(false)

  // const platform = Platform.select({
  //   ios: () => {return 'IOS'},
  //   android: () => {return 'ANDROID'}
  // })()

  

    async function signInWithGoogleAsync() {
        try {
          const result = await Google.logInAsync({
            androidClientId: '71461667183-43vlll91sjg85jcqvrd73he5fr13r9u6.apps.googleusercontent.com',
            iosClientId: '71461667183-j0cssemi3js5fpjpjdkj9v4gka54jopb.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
          });
      
          if (result.type === 'success') {
            verifyGoogleLogin(result.user)            
            
          } else {
            toastRef.current.show('A fallado el login de google')
          }
        } catch (e) {
          toastRef.current.show('Error interno de google')
        }
      }

    const verifyGoogleLogin = async (user) => {
      setIsLoading(true)
      

      fetch('https://salsantiago-api.herokuapp.com/googlemobile', {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json',
        },
        body: JSON.stringify(user),
        })
        .then(x => x.text())
        .then(x => {        
            try {
                return JSON.parse(x)
            } catch {
                throw x
            }
        })
        .then(x => {

            if (x.ok) {
                setIsLoading(false)
                AsyncStorage.setItem('token', x.token)
                .then(() => {
                    navigation.navigate('Home')
                })
            }else {
                setIsLoading(false)
                toastRef.current.show('Inicio de sesión ha fallado')
            }
            
        })
        .catch(e => {
            setIsLoading(false)
            Alert.alert('Error', e)    
        })    

    }   

    return (
        <View style={styles.container}>
            
            <SocialIcon title="Iniciar sesión con Google"
            button
            type="google"
            loading={ isLoading }
            onPress={ signInWithGoogleAsync }
            />
            
        </View>
    )
}

export default LoginGoogle

const styles = StyleSheet.create({
    container: {
      flex: 1,
    //   backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });