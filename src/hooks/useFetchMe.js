import { useState, useEffect } from 'react'
import { AsyncStorage } from 'react-native'

const useFetchMe = (url) => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])   

    const fetchData = async () => {
        const token = await AsyncStorage.getItem('token')
        const response = await fetch(url, {
            headers: {
                'authorization': token,
            }
        })
        const _data = await response.json()
        setData(_data)
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])
    return { loading, data }

}

export default useFetchMe