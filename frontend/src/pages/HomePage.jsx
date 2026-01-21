import React from 'react'
import { useSelector } from 'react-redux'
import UserDahboard from '../components/UserDahboard'
import OwnerDahboard from '../components/OwnerDahboard'
import DeliveryBoyDahboard from '../components/DeliveryBoyDahboard'

const HomePage = () => {

  // Reads data from the Redux store
  const {userData} = useSelector(state=>state.user)

  return (
    <div className='w-[100vw] min-h-[100vh] pt-[100px] flex flex-col items-center bg-[#fff9f6]'>
      {userData.role == "user" && <UserDahboard/> }
      {userData.role == "owner" && <OwnerDahboard/> }
      {userData.role == "deliveryBoy" && <DeliveryBoyDahboard/> }
    </div>
  )
}

export default HomePage