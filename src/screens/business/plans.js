import React, { useState, useEffect } from 'react'
import { AsyncStorage, SafeAreaView } from 'react-native'

import ListMyPlans from '../../components/business/ListMyPlans'
import NoContent from '../../components/NoContent'

const plans = ({ navigation }) => {
    const [myPlans, setMyPlans] = useState([])

    useEffect(() => {
        getUserInfo()
        .then(user => {
            if (user) {
                getData(user)
            }      
        })   
    }, [])

    const getUserInfo = async () => {
        const token = await AsyncStorage.getItem('token')
        const apiUser = `https://salsantiago-api.herokuapp.com/me`
        const resultUser = await fetch(apiUser, {
                    headers: {
                        'authorization': token,
                    },
                })
        let { user, ok, err } = await resultUser.json()
                
        if(ok) {
          return user
        }else {
            navigation.navigate('Login')
        }
        
    }

    const getData = async (user) => {
        const token = await AsyncStorage.getItem('token')
        const apiPlans = `https://salsantiago-api.herokuapp.com/myplans/${user._id}`
        const resultPlans = await fetch(apiPlans, {
                    headers: {
                        'authorization': token,
                    },
                })
        let plansData = await resultPlans.json()

        if( plansData.ok ) {
            setMyPlans(plansData.obj)
        } else {
            setMyPlans([])
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            {
                myPlans.length > 0 
                ? <ListMyPlans myPlans={ myPlans } />
                : <NoContent />
            }
            
        </SafeAreaView>
    )
}

export default plans
