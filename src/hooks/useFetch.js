import { useState, useEffect } from 'react'

export const useFetch = (url) => {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState([])

    const fetchData = async () => {
        const response = await fetch(url)
        const _data = await response.json()
        setData(_data)
        setLoading(false)
    }

    useEffect(() => {
        fetchData()
    }, [])
    return { loading, data }


}


export default useFetch