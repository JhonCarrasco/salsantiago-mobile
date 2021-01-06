import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, AsyncStorage } from 'react-native'
import { Card, Button, Icon } from 'react-native-elements'
import Moment from 'moment'
import ProgressBar from 'react-native-progress/Bar'

const ListMyAttendances = (props) => {
    const { myAttendances, userId, setReload, myPlans, toastRef, setChosenDropdown } = props
    
    return (
        <FlatList 
            data={ myAttendances }
            renderItem={(myAttendance) => <AttendanceCard 
                                            myAttendance={ myAttendance } 
                                            userId={ userId } 
                                            setReload={ setReload } 
                                            myPlans={ myPlans } 
                                            toastRef={ toastRef }
                                            setChosenDropdown={ setChosenDropdown }/>}
            keyExtractor={(item, index) => index.toString()}
        />
    )
}

export default ListMyAttendances

const AttendanceCard = (props) => {
    const { myAttendance, userId, setReload, myPlans, toastRef, setChosenDropdown } = props
    const { item, index } = myAttendance
    const isoWeekday = Moment(item.date_session).isoWeekday()
    const [dayName, setDayName] = useState('')
    const [stateButtonColor, setStateButtonColor] = useState('#00E500') // green
    const [exists, setExists] = useState(false)
    
    
    useEffect(() => {
        setDayName(getDayName(isoWeekday))
        if (userExist(userId)) {
            setStateButtonColor('#cf2a27') // red
            setExists(true)
        } else {
            setStateButtonColor('#00E500') // green
            setExists(false)
        }
        
    }, [item])

    const userExist = (idUser) => {
        
        let user = item.concurrence.filter(elem => elem === idUser)
        return user.length > 0 ? true : false
    }

    const getDayName = (isoday) => {
        switch (isoday) {
            case 1:
                return 'Lunes'
            case 2:
                return 'Martes'
            case 3:
                return 'Miércoles'
            case 4:
                return 'Jueves'
            case 5:
                return 'Viernes'
            case 6:
                return 'Sábado'
            default : return 'Domingo'
        }
    }

    const updateConcurrence = async (attendanceObj) => {
        let plan = []
        if(exists) {
            // borrar userId en concurrence
            let indexItem = attendanceObj.concurrence.indexOf(userId)
            attendanceObj.concurrence.splice(indexItem, 1)
            plan = await myPlans.filter(elem => elem.course[0]._id === attendanceObj.course_id._id) 
            plan[0].count_tokens -= 1

            
        } else {
            // guardar userId en concurrence
            attendanceObj.concurrence.push(userId)     
            plan = await myPlans.filter(elem => elem.course[0]._id === attendanceObj.course_id._id)  
            plan[0].count_tokens += 1
            
        }

        const concurrenceSize = attendanceObj.concurrence.length
        const maxCapacity = attendanceObj.course_id.capacity
        // remove || add
        if( (concurrenceSize >= 0 && exists) || (concurrenceSize <= maxCapacity && !exists) ) {
            // call apis to update (plan(count_tokens) and attendance(concurrance))
            await updatePlan(plan[0])
            await updateAttendance(attendanceObj)
        }

        setChosenDropdown(attendanceObj.course_id._id)
        setReload(true)
                
    }

    const updatePlan = async (updateMyPlan) => {
        const token = await AsyncStorage.getItem('token')

        const objUpdate = {
            count_tokens: updateMyPlan.count_tokens
        }
        
        fetch(`https://salsantiago-api.herokuapp.com/myplans/${updateMyPlan._id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'Application/json',
                'authorization': token,
            },
            body: JSON.stringify(objUpdate)
        })
        // .then((result) => {
            
        //     if (result.ok) {
        //         console.log('updatePlan', result.ok)
        //         // toastRef.current.show("Actualizado correctamente")
        //     }else {
        //         console.log('updatePlan', result.ok)
        //         // toastRef.current.show("No actualizado")
        //     }
        // })
        // .catch(e => {
        //     // toastRef.current.show("Error al actualizar el nombre")
        //     console.log('error updatePlan()', e)
        // })
    }

    const updateAttendance = async (updateMyAttendance) => {
        const token = await AsyncStorage.getItem('token')

        const objUpdate = {
            concurrence: updateMyAttendance.concurrence
        }
        
        fetch(`https://salsantiago-api.herokuapp.com/myattendances/${updateMyAttendance._id}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'Application/json',
                'authorization': token,
            },
            body: JSON.stringify(objUpdate)
        })
        .then((result) => {
            
            if (result.ok) {
                if(!exists) {
                    toastRef.current.show("Reservado correctamente")
                } else {
                    toastRef.current.show("Reserva cancelada")
                }
                
            }else {
                toastRef.current.show("No hubo cambio en la reserva")
            }
        })
        .catch(e => {
            toastRef.current.show("Error al reservar")
        })
    }

    return (
        <Card containerStyle={{backgroundColor: '#9fc5f8', borderWidth: 1, marginBottom: 10, borderRadius: 8 }}>
            <View>
                
                <View style={{ flex: 1, flexDirection: 'row', paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{ dayName + ' ' + Moment.utc(item.date_session, 'YYYY-MM-DD').format('DD-MM') }</Text>
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
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <TouchableOpacity style={{ height: 30, width: 'auto', backgroundColor: stateButtonColor, borderRadius: 4, borderWidth: 2,
                            borderColor: '#4d4d4d', justifyContent: 'center' }} onPress={ () => updateConcurrence(item) }>
                            <Text style={{ fontWeight: 'bold', color: '#fff', paddingHorizontal: 10, fontSize: 16 }}>Reservar</Text>
                        </TouchableOpacity>
                    </View>
                </View>


                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingHorizontal: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Cupos: </Text>
                        <ProgressBar 
                        progress={( item.concurrence.length / item.course_id.capacity)} 
                        width={200} 
                        height={15}
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
