import React, { useState, useEffect } from 'react'
import { Text, View, FlatList } from 'react-native'
import { Card } from 'react-native-elements'
import Moment from 'moment'

const ListMyPlans = (props) => {
    const { myPlans } = props
    

    return (
        <FlatList 
            data={ myPlans }
            renderItem={(myPlan) => <PlanCard myPlan={ myPlan } />}
            keyExtractor={(item, index) => index.toString()}
        />
    )
}

export default ListMyPlans

const PlanCard = (props) => {
    const { myPlan } = props
    const { item, index } = myPlan
    const [stateDescription, setStateDescription] = useState('Vigente')
    const [cardColor, setCardColor] = useState('#00E500') // green

    useEffect(() => {
        let currentDate = new Date()
 
        if ( Moment(item.expiration).isBefore(Moment(currentDate)) ) {
            setStateDescription('Vencido')
            setCardColor('#ffa500') // orange
        } else if ( item.count_tokens === item.total_tokens) {
            setStateDescription('Completado')
            setCardColor('#e5e500') // yellow
        }
    }, [])

    
    return (
        <Card containerStyle={{backgroundColor: cardColor, borderWidth: 0, marginBottom: 10 }}>
            <View>
                <View style={{ flexDirection: 'row', paddingTop: 5, paddingHorizontal: 10 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{item.course[0].description}</Text>
                </View>

                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10, paddingHorizontal: 10 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold' }}>Estado: </Text>
                        <Text>{ stateDescription }</Text>
                    </View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold' }}>Vence: </Text>
                        <Text >{ Moment(item.expiration, 'YYYY-MM-DD').format('DD-MM-YYYY') }</Text>
                    </View>
                </View>

                <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5, paddingHorizontal: 10 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontWeight: 'bold' }}>Saldo tokens: </Text>
                        <Text>{item.count_tokens}/{item.total_tokens}</Text>
                    </View>
                </View>
            </View>
        </Card>
    )

}
