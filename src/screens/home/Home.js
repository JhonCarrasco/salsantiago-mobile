import React, { useState, useEffect, useRef } from 'react'
import { View, AsyncStorage, Text, StyleSheet, SafeAreaView } from 'react-native'
import moment from 'moment-timezone'
import Toast from 'react-native-easy-toast'
import ListMyAttendancesToday from '../../components/home/ListMyAttendancesToday'
import Loading from '../../components/Loading'

const Home = ({ navigation }) => {
  const [userInfo, setUserInfo] = useState({})
  const [myAttendances, setMyAttendances] = useState([]) 
  const [loading, setLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('')
  const toastRef = useRef()
  const [refreshing, setRefreshing] = useState(false)
    
  

  useEffect(() => {
    getUserInfo()
    .then(async user => {
        if (user) {
            await getAttendanceData(user)
        }      
    })  
    
    setRefreshing(false)
  }, [refreshing])

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
      
      setLoading(false)
      navigation.navigate('Login')
    }
    
}

const getAttendanceData = async (user) => {
  
  const token = await AsyncStorage.getItem('token')
  const apiPlans = `https://salsantiago-api.herokuapp.com/myattendancetoday?user_id=${user._id}`
  const result = await fetch(apiPlans, {
              headers: {
                  'authorization': token,
              },
          })
  let data = await result.json()

  if( data.ok ) {
    setUserInfo(user)
    filterData(data.obj).then(setMyAttendances)
    
    setLoading(false)
  } else {
    setLoading(false)
  }
}

const filterData = async (data) => {
  
  const currentDate = moment.tz(new Date(), 'America/Santiago').format()
  
  const filteredOut = await data.filter(item => moment(currentDate).isBefore(moment(item.date_session))
                && moment(item.date_session).format('YYYY-MM-DD') === (moment(currentDate).format('YYYY-MM-DD')) 
                )
  return filteredOut
}

    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
            
              { myAttendances.length > 0 ? 
                <ListMyAttendancesToday 
                myAttendances={ myAttendances } 
                userId={ userInfo._id } 
                toastRef={ toastRef } 
                setRefreshing={ setRefreshing }
                /> 
              : <Text>Sin clases hoy</Text>}
                       
            <Toast ref={ toastRef } position="center" opacity={0.9} />
            <Loading text={loadingText} isVisible={loading} />
        </View>
      </SafeAreaView>
      
    )
}

Home.navigationOptions = ({
  title: 'Inicio',
})

export default Home

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
