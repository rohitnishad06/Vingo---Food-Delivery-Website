import React, { useEffect, useState } from 'react'
import Navbar from './Navbar'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { serverUrl } from '../App'

const DeliveryBoyDahboard = () => {

  const {userData} = useSelector(state=>state.user)
  const [availableAssignments, setAvailableAssignments] = useState([])
  const [currentOrder, setCurrentOrder] = useState();

  // get orders
  const getCurrentOrder = async() => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-current-order`,{withCredentials:true})
      console.log(result.data)
      setCurrentOrder(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  // get assignment 
  const getAssignments = async() =>{
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`,{withCredentials:true})
      console.log(result.data)
      setAvailableAssignments(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  // accept order
  const acceptOrder = async(assignmentId) => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/accept-order/${assignmentId}`,{withCredentials:true})
      console.log(result.data)
      await getCurrentOrder();
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    getAssignments();
    getCurrentOrder()
  },[])
  
  return (
    <div className='w-full min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      <Navbar/>

      <div className='w-full max-w-[800px] flex flex-col gap-5 items-center'>

        {/* Delivery Boy details */}
        <div className='bg-white rounded-2xl shadow-md p-5 flex-col justify-start items-center w-[90%] border border-orange-100 text-center gap-2'>
        <h1 className='text-xl font-bold text-[#ff4d2d]'>Welcome, {userData.fullName}</h1>
        <p className='text-[#ff4d2d]'><span className='font-semibold'>Latitute :</span> {userData.location.coordinates[1]}, <span className='font-semibold'>Longitude : </span> {userData.location.coordinates[0]}</p>
        </div>

        {/* available orders */}
        {!currentOrder && 
        <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100'>
          <h1 className='text-lg font-bold mb-4 flex items-center gap-2'>Available Orders</h1>
          <div className='space-y-4'>
            {availableAssignments.length>0 ? (
                availableAssignments.map((a,index) => (
                  <div className='border rounded-lg p-4 flex justify-between items-center' key={index}>
                    <div>
                      {console.log(a.deliveryAddress)}
                      <p className='text-sm font-semibold'>{a?.shopName}</p>
                      <p className='text-sm text-gray-500'><span className='font-semibold'>Delivery Address :</span> {a?.deliveryAddress.text}</p>
                      <p className='text-xs text-gray-400'>{a.items.length} items | {a.subTotal} </p>
                    </div>
                    <button className='bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600' onClick={()=>acceptOrder(a.assignmentId)}>Accept</button>
                  </div>
                ))
              ) : <p className='text-gray-400 text-sm'>No Available Orders</p>
            }
          </div>
        </div>
        }

        {/* current Orders */}
        {currentOrder && 
          <div className='bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100'>
            <h2 className='text-lg font-semibold mb-3'>Current Order </h2>
            <div className='border rounded-lg p-4 mb-3'>
              <p className='font-semibold text-sm'>{currentOrder.shopOrder.shop.name}</p>
              <p className='text-sm text-gray-500'>{currentOrder.deliveryAddress?.text}</p>
              <p className='text-xs text-gray-400'>{currentOrder.shopOrder.shopOrderItems.length} items | {currentOrder.shopOrder.subTotal}</p>
            </div>
          </div>
        }
        

      </div>
    </div>
  )
}

export default DeliveryBoyDahboard