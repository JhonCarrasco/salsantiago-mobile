import { StatusBar } from 'expo-status-bar';

import React, {useEffect, useState } from 'react';
import {  
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';
import Icon from "react-native-vector-icons/MaterialIcons";
import Moment from 'moment';

export default ListRecords = ({item, onClickFunction}) => {
    //Custom Component for the Expandable List
  const [layoutHeight, setLayoutHeight] = useState(0);
  

  useEffect(() => {
    if (item.isExpanded) {
      setLayoutHeight(null);
    } else {
      setLayoutHeight(0);
    }
  }, [item.isExpanded]);

  
  return (
    <View>
      {/*Header of the Expandable List Item*/}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onClickFunction}
        style={styles.header}

        >
          
          <Icon 
            name={item.isExpanded ? 'keyboard-arrow-down' : 'keyboard-arrow-right'} 
            size={22} 
            style={ styles.iconLeft }/>

          <Text style={styles.headerTextLeft}>
            {item.course_id.description}
          </Text>
          <Text style={styles.headerTextRight}>
            {
            Moment(item.initiate, 'YYYY-MM-DD').format('DD/MM/YYYY')
            }
          </Text>
          
      </TouchableOpacity>
      <View style={styles.separator} />
      <View
        style={{
          height: layoutHeight,
          overflow: 'hidden',
          backgroundColor: '#d3d3d3'
        }}>

        <View style={{ flexDirection: 'row', paddingTop: 5, paddingHorizontal: 10 }}>
            <Text style={{ fontWeight: 'bold' }}>Monto: </Text>
            <Text>{ item.price }</Text>
        </View>

        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', paddingTop: 5, paddingHorizontal: 10 }}>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold' }}>Plan: </Text>
                <Text>{ item.total_tokens }</Text>
                <Text> tokens</Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold' }}>Tokens: </Text>
                <Text >{ item.count_tokens }</Text>
            </View>
        </View>

        <View style={{ flexDirection: 'row', paddingTop: 5, paddingBottom: 5, paddingHorizontal: 10 }}>
            <View style={{ flexDirection: 'row' }}>
                <Text style={{ fontWeight: 'bold' }}>Duración tokens: </Text>
                <Text>{ Moment(item.initiate, 'YYYY-MM-DD').format('DD-MM-YYYY') }{' - '}{ Moment(item.expiration, 'YYYY-MM-DD').format('DD-MM-YYYY') }</Text>
            </View>
        </View>
                
        <View style={styles.separator} />

      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
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
})
