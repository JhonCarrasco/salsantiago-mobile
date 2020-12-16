import React, { useState } from 'react'
import { StyleSheet, View, Alert, AsyncStorage } from 'react-native'
import { Icon, Button } from 'react-native-elements'
import { Formik, useFormikContext } from 'formik';
import * as Yup from 'yup'

import InputType from '../../elements/InputType'

const EmailForm = ({ isLoading }) => {
    const { submitForm } = useFormikContext()
    const [showPassword, setShowPassword] = useState(false)
    
    
    return (
      <>
      <InputType fieldName="email" 
                 placeholder="Correo electroníco"
                 containerStyle={ styles.inputForm }
                 rightIcon={
                    <Icon 
                        type="material-community"
                        name="at"
                        iconStyle={ styles.iconRight }
                    />
                }
                autoCapitalize = 'none'/>
      <InputType fieldName="password" 
                placeholder="Contraseña"
                containerStyle={ styles.inputForm }
                password={ true }
                secureTextEntry={ showPassword ? false: true }
                rightIcon={
                    <Icon 
                        type="material-community"
                        name={ showPassword ? "eye-off-outline": "eye-outline"}
                        iconStyle={ styles.iconRight }
                        onPress={ () => setShowPassword(!showPassword)}
                    />
                }
                autoCapitalize = 'none'/>
      <Button title="Iniciar sesión"
            containerStyle={ styles.btnContainerLogin }
            buttonStyle={ styles.btnLogin }
            onPress={ submitForm } 
            loading={ isLoading }/>      
      </>
    )
  }


const LoginForm = ({navigation, toastRef}) => {    
    const [isLoading, setIsLoading] = useState(false)

    const onSubmit = values => {
        setIsLoading(true)
        fetch('https://salsantiago-api.herokuapp.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'Application/json',
        },
        body: JSON.stringify(values),
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
                toastRef.current.show(x.err.message)
            }
            
        })
        .catch(e => {
            setIsLoading(false)
            Alert.alert('Error', e)            
        })    

    }
    return (
        <View style={ styles.formContainer }>
            <Formik
                onSubmit={onSubmit}
                validationSchema={
                Yup.object({
                    email: Yup.string().email('Correo inválido').required('Requerido'),
                    password: Yup.string().min(2, 'Es demasido corto').required('Requerido'),
                })
                }
                initialValues={{ email: '', password: '' }}
            >
            
              <EmailForm isLoading={ isLoading }/>
            
                
            </Formik>
        </View>
        
    )
}

export default LoginForm

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 30,
    },
    inputForm: {
        width: "100%",
        marginTop: 20,
    },
    btnContainerLogin: {
        marginTop: 20,
        width: "95%", 
    },
    btnLogin: {
        backgroundColor: "#00a680",
    },
    iconRight: {
        color: "#c1c1c1",
    },
})
