import React, { useState } from 'react'
import { StyleSheet, View, FlatList } from 'react-native';
import { connect } from 'react-redux'
import ListItem from '../../components/home/ListItem'
import Input from '../../components/home/Input'
import { complete, saveTodo } from '../../redux/reducers/todos'

const styles = StyleSheet.create({
    container: {
      marginTop: 35,
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
    list: {
        alignSelf: 'stretch',
    }
  });

// props definidos en las funciones mapStateToProps y mapDispatchToProps
const Home = ({ data, complete, submit }) => {
    const [value, setValue] = useState('')

  const handleChange = (val) => {
    setValue(val)
  }

  const handleSubmit = () => {
    submit(value)
    setValue('')
  }

    return (
      <View style={styles.container}>
        <Input onSubmit={ handleSubmit } onChange={ handleChange } value={ value }/>
        <FlatList 
            style={ styles.list }
            data={ data }
            keyExtractor={ x => String(x.id) }
            renderItem={ ({ item }) => 
                <ListItem completed={ item.completed } onPress={() => complete(item.id)} desc={ item.desc } />
            }
        />
      </View>
    )
}

const mapStateToProps = state => {
    return { data: state.todos }
}

const mapDispatchToProps = dispatch => ({
  complete: (id) => dispatch(complete(id)),
  submit: (val) => dispatch(saveTodo(val))
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)

