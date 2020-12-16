import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ListItem } from'react-native-elements';
import { map } from 'lodash';

import ModalForm from '../ModalForm'
import ChangeMyInformationForm from './ChangeMyInformationForm'
import ChangeEmailForm from './ChangeEmailForm'
import ChangePasswordForm from './ChangePasswordForm'


export default function AccountOptions (props) {
    const { userInfo, setReloadUserInfo, toastRef } = props
    const [showModal, setShowModal] = useState(false)
    const [renderComponent, setRenderComponent] = useState(null)

    const selectedComponent = (key) => {
        switch(key) {
            case "displayName":
                setRenderComponent(
                    <ChangeMyInformationForm 
                        userInfo={ userInfo }
                        setShowModal={ setShowModal }
                        toastRef={ toastRef }
                        setReloadUserInfo={ setReloadUserInfo }
                    />);
                setShowModal(true);
                break;
            case "email":
                setRenderComponent(
                    <ChangeEmailForm 
                        userInfo={ userInfo }
                        setShowModal={ setShowModal }
                        toastRef={ toastRef }
                        setReloadUserInfo={ setReloadUserInfo }
                    />
                );
                setShowModal(true);
                break;
            case "password":
                setRenderComponent(
                    <ChangePasswordForm 
                        setShowModal={ setShowModal }
                        toastRef={ toastRef }
                        setReloadUserInfo={ setReloadUserInfo }
                    />
                );
                setShowModal(true);
                break;
            default:
                setRenderComponent(null);
                setShowModal(false);
                break;
        }
    }

    const menuOptions = generateOptions(selectedComponent)
    return (
        <View>
            {
                map(menuOptions, (menu, index) => (
                    <ListItem 
                        key={ index }
                        title= { menu.title }
                        leftIcon={{
                            type: menu.iconType,
                            name: menu.iconNameLeft,
                            color: menu.iconColorLeft
                        }}
                        rightIcon={{
                            type: menu.iconType,
                            name: menu.iconNameRight,
                            color: menu.iconColorRight
                        }}
                        containerStyle={ styles.menuItem }
                        onPress={ menu.onPress }
                    />
                ))
            }
            
            { renderComponent && (
                <ModalForm isVisible={ showModal } setIsVisible={ setShowModal }>
                    { renderComponent }
                </ModalForm>
            )}
            
        </View>
    )
}

function generateOptions(selectedComponent) {
    return [
        {
            title: "Cambiar Mi Información",
            iconType: "material-community",
            iconNameLeft: "account-circle",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("displayName"),
        },
        {
            title: "Cambiar Email",
            iconType: "material-community",
            iconNameLeft: "at",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("email"),
        },
        {
            title: "Cambiar Contraseña",
            iconType: "material-community",
            iconNameLeft: "lock-reset",
            iconColorLeft: "#ccc",
            iconNameRight: "chevron-right",
            iconColorRight: "#ccc",
            onPress: () => selectedComponent("password"),
        },
    ]
}

const styles = StyleSheet.create({
    menuItem: {
        borderBottomWidth: 1,
        borderBottomColor: "#e3e3e3",
    },
})
