import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, AsyncStorage, Alert } from 'react-native'
import { Button } from'react-native-elements';
import Toast from 'react-native-easy-toast'

import InfoUser from '../../components/profile/InfoUser'
import AccountOptions from '../../components/profile/AccountOptions'
import Loading from '../../components/Loading'


const Profile = ({navigation}) => {
    const [userInfo, setUserInfo] = useState(null)
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [reloadUserInfo, setReloadUserInfo] = useState(false)
    const toastRef = useRef()

    useEffect(() => {
        getData()  
        setReloadUserInfo(false)    
    }, [reloadUserInfo])

    
    const getData = async () => {
        setLoadingText('Cargando Perfil...')
        setLoading(true)

        const token = await AsyncStorage.getItem('token')
        const apiUser = `https://salsantiago-api.herokuapp.com/me`
        const resultUser = await fetch(apiUser, {
                    headers: {
                        'authorization': token,
                    },
                })
        
        let { user, ok, err } = await resultUser.json()
        
        if (ok) {
            if(!user.google) {
                const apiAvatar = `https://salsantiago-api.herokuapp.com/avatar`
                const resultAvatar = await fetch(apiAvatar, {
                    headers: {
                        'authorization': token,
                    },
                })
                const { avatar } = await resultAvatar.json()
                
                if (avatar) {
                    user.googleImg = avatar.photoURL
                } else {
                    user.googleImg = null
                }
            }            
        }
        else{
            signOut()
        }
              
        setUserInfo(user) 
        setLoading(false)
        
    }

        
    const signOut = () => {
        
        AsyncStorage.removeItem('token')
        .then(() => navigation.navigate('Login'))
        .catch(e => Alert.alert(e))
    }

    return (
        <View style={ styles.viewUserInfo }>
            {userInfo &&
            <>
            
            <InfoUser 
                userInfo={ userInfo } 
                toastRef={ toastRef }
                setLoading={ setLoading }
                setLoadingText={ setLoadingText }
                setReloadUserInfo={ setReloadUserInfo }
                />

            <AccountOptions 
                userInfo={ userInfo } 
                toastRef={ toastRef }
                setReloadUserInfo={ setReloadUserInfo }
                />

            </>            
            }
            
            <Button 
                title="Cerrar sesión" 
                buttonStyle={ styles.btnCloseSession }
                titleStyle={ styles.btnCloseSessionText}
                onPress={() => signOut() }
            />
            <Toast ref={ toastRef } position="center" opacity={0.9} />
            <Loading text={loadingText} isVisible={loading} />
            
        </View>
    )
}

Profile.navigationOptions = ({
    title: 'Perfil',
})

export default Profile


const styles = StyleSheet.create({
    viewUserInfo: {
        minHeight: "100%",
        backgroundColor: "#f2f2f2",
    },
    btnCloseSession:{
        marginTop: 30,
        borderRadius: 0,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e3e3e3",
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
        paddingTop: 10,
        paddingBottom: 10,
    },
    btnCloseSessionText: {
        color: "#ffb400",
    },
})
