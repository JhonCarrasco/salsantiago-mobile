import React from 'react'
import { Text } from 'react-native'
import { useField } from 'formik';
import { Input,  } from 'react-native-elements';

const InputType = ({ fieldName, ...props }) => {
    const [field, meta] = useField(fieldName)
    return (
        <>
        <Input 
        onChangeText={ field.onChange(fieldName) }
        onBlur={ field.onBlur(fieldName) }
        value={ field.value }
        { ...props }
        />
        { meta.error && meta.touched && (
        <Text style={{ color: 'red'}}>{ meta.error }</Text>
        )}
        </>
    )
}

export default InputType

