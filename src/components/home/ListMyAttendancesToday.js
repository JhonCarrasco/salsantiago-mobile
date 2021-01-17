import React, { useState, useEffect, useCallback } from 'react'
import { StyleSheet, Text, View, FlatList, RefreshControl } from 'react-native'
import { Card, Icon, CheckBox } from 'react-native-elements'
import Moment from 'moment'
import ProgressBar from 'react-native-progress/Bar'


const ListMyAttendancesToday = (props) => {
    const { myAttendances, userId, toastRef, setRefreshing } = props
    const [refresh, setRefresh] = useState(false)

    useEffect(() => {
        setRefreshing(refreshing => setRefresh(refreshing))
    }, [])
    
    const onRefresh = () => {
        setRefreshing(true)
    }

    return (
        
        <FlatList 
            data={ myAttendances }
            renderItem={(myAttendance) => <AttendanceCard 
                        myAttendance={ myAttendance } 
                        userId={ userId } 
                        toastRef={ toastRef } />}
            keyExtractor={(item, index) => index.toString()}
            refreshControl={
            <RefreshControl refreshing={ refresh } onRefresh={ onRefresh } />
            }
        />
        
    )
}

export default ListMyAttendancesToday

const AttendanceCard = (props) => {
    const { myAttendance, userId, toastRef } = props
    const { item, index } = myAttendance
    const [titleCheckBox, setTitleCheckBox] = useState('Reservado')
    const [exists, setExists] = useState(false)
    
    useEffect(() => {
        
        userExist(userId)
        .then(value => {
            
            if (value) {
                
                setTitleCheckBox('Reservado')
                setExists(true)
            } else if ( item.concurrence.length === item.capacity ) {
                
                setTitleCheckBox('Sin cupo')
                setExists(false)
            } else {
                setTitleCheckBox('Disponible')
                setExists(false)
            }
        })
        .catch(err => console.log(err))
        
    }, [myAttendance])

    const userExist = async (idUser) => {
        
        let user = await item.concurrence.filter(elem => elem === idUser)
        const result = await user.length > 0 ? true : false
        
        return result
    }


    return (
        <Card containerStyle={{backgroundColor: '#9fc5f8', borderWidth: 1, marginBottom: 10, borderRadius: 8 }}>
            <View>

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', justifyContent:'center' }}>
                        <CheckBox
                                checkedColor='#00a680'
                                uncheckedColor='#00a680'
                                checked={ exists }
                                title={ titleCheckBox }
                                size={ 20 }
                                containerStyle={{ backgroundColor: '#fff'}}
                                onPress={() => exists ? 
                                      toastRef.current.show("Debe ir a Asistencia para cancelar") 
                                    : toastRef.current.show("Debe ir a Asistencia para reservar") }
                            />
                    </View>
                </View>
                
                
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingHorizontal: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row', paddingBottom: 10  }}>
                        <Icon 
                        name='at'
                        type='material-community'
                        size= {18}
                        containerStyle={ {backgroundColor: '#ffff00'}}/>
                        <Text style={{ fontWeight: 'bold', backgroundColor: '#ffff00', justifyContent: 'center', fontSize: 16 }}>{ ' ' + Moment.utc(item.date_session).format("HH:mm")}</Text>
                    </View>
                    <View style={{ flex: 2, flexDirection: 'row' }}>
                        <Text style={{ flex: 1, alignItems: 'flex-end', fontWeight: 'bold', fontSize: 18 }}>{ item.course_id.description }</Text>
                    </View>
                </View>


                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingHorizontal: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Cupos: </Text>
                        <ProgressBar 
                        progress={( item.concurrence.length / item.course_id.capacity)} 
                        width={190} 
                        height={20}
                        />
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, backgroundColor: '#ffff00' }}>{item.concurrence.length + '/' + item.course_id.capacity}</Text>
                    </View>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingHorizontal: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold', color: '#fff', backgroundColor: '#085394', fontSize: 13 }}>Profesor: { item.course_id.instructor }</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end'}}>
                        <Text style={{ fontWeight: 'bold', backgroundColor: '#ffa500', fontSize: 16 }}>Sala: { item.course_id.classroom }</Text>
                    </View>
                </View>

            </View>
        </Card>
    )

}

const styles = StyleSheet.create({})
