import React, { useState, useEffect } from 'react'
import { View, AsyncStorage, Text, StyleSheet, SafeAreaView } from 'react-native'
import RNPickerSelect from 'react-native-picker-select'
import moment from 'moment'

import ListMyAttendancesRegistry from '../../components/book/ListMyAttendancesRegistry'
import NoContent from '../../components/NoContent'

const registry = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState(null)
  const [myCourses, setMyCourses] = useState([])    
  const [myAttendances, setMyAttendances] = useState([])  
  const [totalAttendances, setTotalAttendances] = useState(0)
  const [startAttendance, setStartAttendance] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const limitAttendance = 12

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
          setUserInfo(user)
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
        let currentDate = moment.tz(new Date(), 'America/Santiago').format()

        const arrayPlans = await plansData.obj.filter( elem => moment(elem.expiration).isAfter(moment(currentDate)))                  
          
        const arrayCourses = await arrayPlans.filter( elem => moment(elem.expiration).isAfter(moment(currentDate)))
        .map(item => {
          return {
            value: item.course[0]._id,
            label: item.course[0].description
          }
        })
        
        setMyCourses(arrayCourses)

      } else {
        
        setMyCourses([])
      }
    }

    const handleDropdownCourses = async (value) => {
      // cargar asistencia valida, según fecha
      const token = await AsyncStorage.getItem('token')
      
      const api = `https://salsantiago-api.herokuapp.com/myattendancehistory?course_id=${value}&user_id=${userInfo._id}&from=0&limit=${limitAttendance}`
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
                  setTotalAttendances(data.total)
                  setStartAttendance(data.size)
                } else {
                  setMyAttendances([])
                }
            })
            .catch(err => {
              // console.log(err)
            })
                              
    }

    const handleLoadMore = async () => {
      
      myAttendances.length < totalAttendances && setIsLoading(true)
      
      const course_id = myAttendances[0].course_id._id
     
      const token = await AsyncStorage.getItem('token')     
      const api = `https://salsantiago-api.herokuapp.com/myattendancehistory?course_id=${course_id}&user_id=${userInfo._id}&from=${startAttendance}&limit=${limitAttendance}`
      const result = await fetch(api, {
                  headers: {
                      'authorization': token,
                  },
              })
      let data = await result.json()
  
      if( data.ok ) {
        
        setMyAttendances([...myAttendances, ...data.obj]);
        setTotalAttendances(data.total)
        setStartAttendance(startAttendance + data.size)
        setIsLoading(false)
        myAttendances.length < totalAttendances
      } else {
        setIsLoading(false)
      }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <View style={styles.container}>
                <PickerSelect placeholderText={"Actividades..."} 
                            listItem={ myCourses } 
                            handleDropdownChange={ handleDropdownCourses }
                            />

                {
                  myAttendances.length > 0 ?
                  <>
                  <View style={{flexDirection: 'row', padding: 10, backgroundColor: '#bdbdbd'}}>
                    <Text style={styles.titleTextLeft}>Actividad</Text>  
                    <Text style={styles.titleTextRight}>Fecha Asistencia</Text>             
                  </View>
                  
                  <ListMyAttendancesRegistry 
                    myAttendances={ myAttendances } 
                    handleLoadMore={ handleLoadMore } 
                    isLoading={ isLoading }/> 
                  
                  </>            
                  : <NoContent />
                }
                
            </View>
        </SafeAreaView>
        
    )
}

export default registry

const PickerSelect = (props) => {
    const { placeholderText, listItem, handleDropdownChange } = props
    const [dropdownValue, setDropdownValue] = useState(null)

    useEffect(() => {
      if (listItem.length != 0) {
       setDropdownValue(listItem[0].value)
      }
    }, [listItem])

    
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



const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 0,
      },
      titleTextLeft: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'left'
      },
      titleTextRight: {
        flex: 1,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'right'
      },
      iconLeft: {
        color: "#c1c1c1",
      },
      
})

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
