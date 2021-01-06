import React, { useState, useEffect, useRef } from 'react'
import { View, AsyncStorage, Text, StyleSheet, ScrollView } from 'react-native'
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select'
import moment from 'moment'
import Toast from 'react-native-easy-toast'
import Loading from '../../components/Loading'

import ListMyAttendances from '../../components/book/ListMyAttendances'

const attendance = () => {
    
  const [userInfo, setUserInfo] = useState({})
  const [myPlans, setMyPlans] = useState([])
  const [myCourses, setMyCourses] = useState([])    
  const [myAttendances, setMyAttendances] = useState([])  
  const [reload, setReload] = useState(false)
  const [chosenDropdown, setChosenDropdown] = useState(null)
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const toastRef = useRef()
    

    useEffect(() => {
        getUserInfo()
        .then(user => {
            if (user) {
                getData(user)
            }      
        })  
        setReload(false)
    }, [reload])

    const getUserInfo = async () => {
      setLoadingText('Cargando Registros...')
      setLoading(true)
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
           return null
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
        let currentDate = new Date()
          const arrayPlans = await plansData.obj.filter( elem => moment(elem.expiration).isAfter(moment(currentDate)))                  
          
          const arrayCourses = await arrayPlans.filter( elem => moment(elem.expiration).isAfter(moment(currentDate)))
          .map(item => {
            return {
              value: item.course[0]._id,
              label: item.course[0].description
            }
          })
          setUserInfo(user)
          setMyPlans(arrayPlans)
          setMyCourses(arrayCourses)
          setLoading(false)

      } else {
        setMyPlans([])
        setMyCourses([])
        setLoading(false)
      }
    }

    const handleDropdownCourses = async (value) => {
      // cargar asistencia valida, según fecha
      const token = await AsyncStorage.getItem('token')
      const api = `https://salsantiago-api.herokuapp.com/myattendances/${value}`
      fetch(api, {
                  headers: {
                    'Content-Type': 'Application/json',
                      'authorization': token,
                  },
              })
              .then(x => x.text())
              .then(x => {
                  try {
                      return JSON.parse(x)
                  } catch {
                      throw x
                  }
              })
              .then(data => {
                if( data.ok ) {
                  setMyAttendances(data.obj)
                } else {
                  setMyAttendances([])
                }
            })
            .catch(err => {})
            

                  
    }


    
    return (

        <View style={styles.container}>
                  
          <View>
              <PickerSelect placeholderText={"Actividades..."} 
                            listItem={ myCourses } 
                            handleDropdownChange={ handleDropdownCourses }
                            chosenDropdown={ chosenDropdown }/>
          </View>
          <View>
            { myAttendances ? 
              <ListMyAttendances myAttendances={ myAttendances } 
                                userId={ userInfo._id } 
                                setReload={ setReload } 
                                myPlans={ myPlans }
                                toastRef={ toastRef }
                                setChosenDropdown={ setChosenDropdown }/> 
            : <Text>Cargando...</Text>}
          </View>
          <Toast ref={ toastRef } position="center" opacity={0.9} />

          <Loading text={loadingText} isVisible={loading} />
      </View>
        
    )
}

const PickerSelect = (props) => {
    const { placeholderText, listItem, handleDropdownChange, chosenDropdown } = props
    const [dropdownValue, setDropdownValue] = useState(null)

    useEffect(() => {
      if (listItem.length != 0) {
        chosenDropdown ? 
        setDropdownValue(chosenDropdown) 
        : setDropdownValue(listItem[0].value)
      }
    }, [listItem, chosenDropdown])

    
    return (
        <RNPickerSelect
            placeholder={{
                label: placeholderText,
                value: null,   
                color: "blue"             
            }}
            value={ dropdownValue }
            onValueChange={async (value) => {  
              setDropdownValue(value)              
              await handleDropdownChange(value)
                
            }}
            items={ listItem }
            // InputAccessoryView={() => null}
            style={pickerSelectStyles}
        />

    )
}

export default attendance

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContainer: {
      flex: 1,
    //   paddingHorizontal: 15,
    },
    scrollContentContainer: {
      paddingHorizontal: 5,
      paddingVertical: 5,
    },
    
  });


  const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 2,
      borderColor: 'gray',
      borderRadius: 4,
      color: 'black',
    //   paddingRight: 150, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
    //   borderWidth: 2.0,
    //   borderColor: 'red',
    //   borderRadius: 8,
      color: 'black',
    paddingRight: 150, // to ensure the text is never behind the icon
    },
  });

