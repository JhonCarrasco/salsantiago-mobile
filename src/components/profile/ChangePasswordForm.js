import React, { useState } from 'react';
import { StyleSheet, View, Text, AsyncStorage } from 'react-native';
import { Input, Button } from 'react-native-elements';

import { size } from 'lodash';


export default function ChangePasswordForm(props) {
    const { setShowModal, toastRef, setReloadUserInfo } = props;
    const [formData, setFormData] = useState(defaultValue());
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (e, type) => {
        setFormData({...formData, [type]: e.nativeEvent.text})
    }

    const onSubmit = async () =>  {
        let isSetErrors = true;
        let errorsTemp = {};
        setErrors({});

        if(
            !formData.password ||
            !formData.newPassword ||
            !formData.repeatPassword
        ) {
            errorsTemp = {
                password: !formData.password? "La contraseña no debe estar vacia": "",
                newPassword: !formData.newPassword? "La contraseña no debe estar vacia" : "",
                repeatPassword: !formData.repeatPassword? "La contraseña no debe estar vacia" : ""
            }
        }else if(formData.newPassword !== formData.repeatPassword) {
            errorsTemp = {
                newPassword: "Las contraseñas deben ser iguales",
                repeatPassword: "Las contraseñas deben ser iguales"
            }
        }else if(size(formData.newPassword) < 4) {
            errorsTemp = {
                newPassword: "La contraseña debe contener mínimo 4 caracteres",
                repeatPassword: "La contraseña debe contener mínimo 4 caracteres"
            }
        }else {
            setIsLoading(true);
            const updateData = {
                password: formData.password,
                newPassword: formData.newPassword,
            }

            const token = await AsyncStorage.getItem('token')
            await fetch('https://salsantiago-api.herokuapp.com/user/passwd', {
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
                toastRef.current.show("Contraseña no actualizada")
                setIsLoading(false)
                setShowModal(false)
            })

        }
        isSetErrors && setErrors(errorsTemp);
    }

    return (
        <View style={ styles.view }>
            <Input 
                placeholder="Contraseña actual"
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
            <Input 
                placeholder="Nueva contraseña"
                containerStyle={ styles.input }
                password={ true }
                secureTextEntry={ showPassword ? false: true }
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline": "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword),
                }}
                onChange={(e) => onChange(e, "newPassword") }
                errorMessage={ errors.newPassword }
                 />
            <Input 
                placeholder="Repetir nueva"
                containerStyle={ styles.input }
                password={ true }
                secureTextEntry={ showPassword ? false: true }
                rightIcon={{
                    type: "material-community",
                    name: showPassword ? "eye-off-outline": "eye-outline",
                    color: "#c2c2c2",
                    onPress: () => setShowPassword(!showPassword),
                }}
                onChange={(e) => onChange(e, "repeatPassword") }
                errorMessage={ errors.repeatPassword }
                />
                 
            <Button 
                title="Cambiar contraseña"
                containerStyle={ styles.btnContainer }
                buttonStyle={ styles.btn }
                onPress={ onSubmit }
                loading={ isLoading }
            />      
            <Text>{ errors.other }</Text>      
        </View>
    )
}

function defaultValue() {
    return {
        password: "",
        newPassword: "",
        repeatPassword: "",
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