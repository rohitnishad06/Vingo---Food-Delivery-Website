import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
import { setMyShopData } from '../redux/ownerSlice'

const useGetMyShop = () => {

  const dispatch = useDispatch()

  useEffect(()=>{
    const fetchShop = async() => {
      try {
        const result = await axios.get(`${serverUrl}/api/shop/get-my`)
        dispatch(setMyShopData(result.data))
      } catch (error) {
        console.log(error)
      }
    } 
    fetchShop()
  },[])

}

export default useGetMyShop