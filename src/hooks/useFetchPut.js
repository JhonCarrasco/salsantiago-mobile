import { useState, useEffect } from 'react'
import { AsyncStorage } from 'react-native'

const useFetchPut = (url, values) => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)   

    const fetchData = async () => {
        const token = await AsyncStorage.getItem('token')
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                'Content-Type': 'Application/json',
                'authorization': token,
            },
            body: JSON.stringify(values),
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

export default useFetchPut