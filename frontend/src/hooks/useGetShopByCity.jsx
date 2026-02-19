import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setShopInMyCity, setUserData } from '../redux/userSlice'

const useGetShopByCity = () => {

  const dispatch = useDispatch()
  const {city} = useSelector(state=>state.user)

  useEffect(()=>{
    const fetchShops = async() => {
      try {
        const result = await axios.get(`${serverUrl}/api/shop/get-by-city/${city}`)
        dispatch(setShopInMyCity(result.data))
      } catch (error) {
        console.log(error)
      }
    } 
    fetchShops()
  },[city])

}

export default useGetShopByCity