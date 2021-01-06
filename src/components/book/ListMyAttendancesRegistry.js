import React from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native'
import Moment from 'moment'


const ListMyAttendancesRegistry = (props) => {
    const { myAttendances, handleLoadMore, isLoading } = props

    const currentDate = new Date()
        
    const previousDates = myAttendances.filter(elem => Moment(elem.date_session).isBefore(Moment(currentDate)) )

    return (
        <View>
            {myAttendances.length > 0 ? (
                <FlatList 
                    data={ previousDates }
                    renderItem={(myAttendance) => <AttendanceItem myAttendance={ myAttendance } /> }
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={ 0.5 }
                    onEndReached={ handleLoadMore }
                    ListFooterComponent={ <FooterList isLoading={ isLoading } />}
                />
            ) : (
                <View style={ styles.loader }>
                    <ActivityIndicator size="large" />
                    <Text>Cargando asistencias</Text>
                </View>
            )}
        </View>
        
    )
}

export default ListMyAttendancesRegistry

const AttendanceItem = (props) => {
    const { myAttendance } = props
    const { item, index } = myAttendance

    return (
        <View>
      
            <TouchableOpacity
                activeOpacity={0.8}
                style={styles.header}
                >
                <Text style={styles.headerTextLeft}>
                    {item.course_id.description}
                </Text>
                <Text style={styles.headerTextRight}>
                    {
                    Moment(item.date_session, 'YYYY-MM-DD').format('DD/MM/YYYY')
                    }
                </Text>
                
            </TouchableOpacity>
            <View style={styles.separator} />
      
        </View>
    )

}

function FooterList(props) {
    const { isLoading } = props
  
    if(isLoading) {
        return (
            <View style={ styles.loaderPlans}>
                <ActivityIndicator size='large' color="#0000ff"/>
            </View>
        )
    } else {
        return (
            <View style={ styles.notFoundPlans }>
                <Text>No quedan registros por cargar</Text>
            </View>
        )
    }
  }

const styles = StyleSheet.create({
    loader: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
    },
    header: {
        backgroundColor: '#F5FCFF',
        padding: 8,
        flexDirection: 'row',
      },
      headerTextLeft: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'left'
      },
      headerTextRight: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'right'
      },
      separator: {
        height: 0.5,
        backgroundColor: '#808080',
      },
      loaderPlans: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
      },
      notFoundPlans: {
        marginTop: 10,
        marginBottom: 10,
        alignItems: 'center',
      },
})
