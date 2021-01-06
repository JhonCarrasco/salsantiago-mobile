import React, { useState } from 'react';
import { StyleSheet, View, AsyncStorage, Alert } from 'react-native';
import { Input, Button } from 'react-native-elements';


export default function ChangeMyInformationForm(props) {
    const {userInfo, setShowModal, toastRef, setReloadUserInfo} = props
    const [formData, setFormData] = useState(defaultValue())
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(false)

    
    const onChange = (e, type) => {
        
        setFormData({...formData, [type]: e.nativeEvent.text})
    }

    const onSubmit = async () =>  {

        formData.displayName = !formData.displayName ? userInfo.displayName : formData.displayName


        setError(null);
        if(userInfo.displayName === formData.displayName && !formData.phone) {
            setError("El nombre no ha cambiado");
        }else {
            setIsLoading(true);
            const updateData = {
                displayName: formData.displayName,
                phone: formData.phone ? formData.phone: userInfo.phone,
            }
            const token = await AsyncStorage.getItem('token')
            await fetch(`https://salsantiago-api.herokuapp.com/users/${userInfo._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type': 'Application/json',
                    'authorization': token,
                },
                body: JSON.stringify(updateData),
            })
            .then(() => {
                setIsLoading(false)            
                setShowModal(false)
                setReloadUserInfo(true)    
                if (result.ok) {
                    toastRef.current.show("Actualizado correctamente")
                }else {
                    toastRef.current.show("No actualizado")
                }
            })
            .catch(e => {
                toastRef.current.show("Error al actualizar el nombre")
                setIsLoading(false)
                setShowModal(false)
            })
        }
    }
    
    return (
        <View style={ styles.view }>
            <Input 
                placeholder="Nombre y apellido(s)"
                containerStyle={ styles.input }
                rightIcon={{
                    type: "material-community",
                    name: "account-circle-outline",
                    color: "#c2c2c2",
                }}
                defaultValue={ userInfo.displayName || ""}
                onChange={(e) => onChange(e, "displayName") }
                errorMessage={ error }
            />
            <Input 
                placeholder="Teléfono: +56955559999"
                containerStyle={ styles.input }
                rightIcon={{
                    type: "material-community",
                    name: "cellphone",
                    color: "#c2c2c2",
                }}
                defaultValue={ userInfo.phone || ""}
                onChange={(e) => onChange(e, "phone") }
            />
            <Button 
                title="Guardar"
                containerStyle={ styles.btnContainer }
                buttonStyle={ styles.btn }
                onPress={ onSubmit }
                loading={ isLoading }
            />            
        </View>
    )
}

function defaultValue() {
    return {
        displayName: "",
        phone: "",
    }
}

const styles = StyleSheet.create({
    view:{
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10,
    },
    input: {
        marginBottom: 10,
    },
    btnContainer: {
        marginTop: 20,
        width: "95%",
    },
    btn: {
        backgroundColor: "#0095ff",
    },
})
