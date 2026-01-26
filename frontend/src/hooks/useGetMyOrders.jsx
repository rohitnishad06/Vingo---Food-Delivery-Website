import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setMyOrder } from '../redux/userSlice'

const useGetMyOrders = () => {

  const dispatch = useDispatch()

  useEffect(()=>{
    const fetchOrders = async() => {
      
      try {
        const result = await axios.get(`${serverUrl}/api/order/my-orders`, {withCredentials:true})
        dispatch(setMyOrder(result.data))
        console.log(result.data)
      } catch (error) {
        console.log(error)
      }
    } 
    fetchOrders()
  },[])

}

export default useGetMyOrders