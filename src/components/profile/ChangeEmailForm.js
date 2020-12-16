import React, { useState } from 'react'
import { StyleSheet, View, AsyncStorage } from 'react-native'
import { Input, Button } from 'react-native-elements'

import { validateEmail } from '../../utils/validations'


export default function ChangeEmailForm(props) {
    const { userInfo, setShowModal, toastRef, setReloadUserInfo} = props
    const [formData, setFormData] = useState(defaultValue())
    const [showPassword, setShowPassword] = useState(false)
    const [errors, setErrors] = useState({})
    const [isLoading, setIsLoading] = useState(false)

    const onChange = (e, type) => {
        setFormData({...formData, [type]: e.nativeEvent.text})
    }

    

    const onSubmit = async () =>  {
        setErrors({});
        if(!formData.email || userInfo.email === formData.email) {
            setErrors({
                email: "El email no ha cambiado",
            })
        }else if(!validateEmail(formData.email)) {
            setErrors({
                email: "El email no es válido",
            })
        }else if(!formData.password) {
            setErrors({
                password: "Debe ingresar la contraseña",
            })
        }else {
            setIsLoading(true);
            const updateData = {
                email: formData.email,
                password: formData.password,
            }

            const token = await AsyncStorage.getItem('token')
            await fetch('https://salsantiago-api.herokuapp.com/user/email', {
                method: "PUT",
                headers: {
                    'Content-Type': 'Application/json',
                    'authorization': token,
                },
                body: JSON.stringify(updateData),
            })
            .then(result => {
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
                toastRef.current.show("Email no actualizado")
                setIsLoading(false)
                setShowModal(false)
            })
            
        }
    }

    return (
        <View style={ styles.view }>
            <Input 
                placeholder="Correo electrónico"
                containerStyle={ styles.input }
                rightIcon={{
                    type: "material-community",
                    name: "at",
                    color: "#c2c2c2",
                }}
                defaultValue={ userInfo.email || ""}
                onChange={(e) => onChange(e, "email") }
                errorMessage={ errors.email }
                autoCapitalize = 'none'
            />
            <Input 
                placeholder="Contraseña"
                containerStyle={ styles.input }
                password={ true }
                secureTextEntry={ showPassword ? false: true }
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline": "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword),
                }}
                onChange={(e) => onChange(e, "password") }
                errorMessage={ errors.password }
                 />
            <Button 
                title="Cambiar email"
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
        email: "",
        password: "",
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
        backgroundColor: "#00a680",
    },
})