import React from 'react'
import { StyleSheet, Text, View, AsyncStorage, Image } from 'react-native'
import { Avatar } from'react-native-elements'
import * as Permissions from 'expo-permissions'
import * as ImagePicker from 'expo-image-picker'



export default function InfoUser (props) {
    const {
    userInfo: { 
        email, displayName, google, googleImg
    },
    toastRef, setLoading, setLoadingText, setReloadUserInfo} = props
    
    const changeAvatar = async () => {
        const resultPermission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const resultPermissionCamera = resultPermission.permissions.cameraRoll.status;

        if(resultPermissionCamera === "denied"){
            toastRef.current.show("Es necesario aceptar los permisos de la galeria");
        }else{
            const result = await ImagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            })
            

            if(result.cancelled) {
                toastRef.current.show("Has cerrado la selección de imagenes");
            }else {
                setLoadingText("Actualizando Avatar")
                setLoading(true)

                uploadImage(result.uri)
                .then( result => {
                    if (result.ok) {
                        setLoading(false)
                        setReloadUserInfo(true)
                    }else {
                        setLoading(false)
                        toastRef.current.show('No actualizado')
                    }
                }).catch( () => {
                    toastRef.current.show("Error al actualizar el avatar")
                })
            }
        }
    }

    const uploadImage = async (uri) => {
                        
        const response = await fetch(uri)
        const blob = await response.blob()
        const type = blob.type
        const filename = uri.split('/').pop()

        const token = await AsyncStorage.getItem('token')

        var formdata = new FormData()
        formdata.append("myfile", { uri: uri, name: filename, type })
        
        const result = await fetch('https://salsantiago-api.herokuapp.com/avatar', {
            method: "PUT",
            headers: {
                'Accept': 'application/json',
              'content-type': 'multipart/form-data',
                'authorization': token,
            },
            body: formdata,
        })   
        
        return result
         
    }
    
    return (
        <View style={ styles.viewUserInfo }>
            <Avatar 
                rounded
                size="large"
                showEditButton={ !google }
                onEditPress={ changeAvatar }
                containerStyle={ styles.userInfoAvatar }
                source={
                    googleImg ? { uri: googleImg } : require("../../../assets/img/avatar-default.jpg")
                }
            />
            <View>
                <Text style={ styles.displayName }>{ displayName ? displayName : "Anónimo" }</Text>
                <Text>{ email ? email : "Social logín" }</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    viewUserInfo: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        backgroundColor: "#f2f2f2",
        paddingTop: 30,
        paddingBottom: 30,
    },
    userInfoAvatar: {
        marginRight: 20,
    },
    displayName: {
        fontWeight: "bold",
        paddingBottom: 5,
    },
})
