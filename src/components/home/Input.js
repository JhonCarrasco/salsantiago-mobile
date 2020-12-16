import React from 'react'
import { StyleSheet, Text, View, TextInput } from 'react-native'

const styles = StyleSheet.create({
    input: {
        backgroundColor: '#eee',
        height: 34,
        alignSelf: 'stretch',
        padding: 8,
    }
})

const Input = ({ onChange, value, onSubmit }) => {
    return (
        <TextInput onSubmitEditing={ onSubmit} onChangeText={ onChange } value={ value } style={ styles.input } />
    )
}

export default Input
