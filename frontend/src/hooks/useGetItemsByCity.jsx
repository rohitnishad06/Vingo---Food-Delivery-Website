import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setItemsInMyCity } from '../redux/userSlice'

const useGetItemsByCity = () => {

  const dispatch = useDispatch()
  const {city} = useSelector(state=>state.user)

  useEffect(()=>{
    const fetchItems = async() => {
      
      try {
        const result = await axios.get(`${serverUrl}/api/item/get-by-city/${city}`)
        dispatch(setItemsInMyCity(result.data))
      } catch (error) {
        console.log(error)
      }
    } 
    fetchItems()
  },[city])

}

export default useGetItemsByCity