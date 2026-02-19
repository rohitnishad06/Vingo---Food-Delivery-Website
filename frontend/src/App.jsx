import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useDispatch, useSelector } from "react-redux";
import HomePage from "./pages/HomePage";
import useGetCity from "./hooks/useGetCity";
import useGetMyShop from "./hooks/useGetMyShop";
import CreateEditShop from "./pages/CreateEditShop";
import AddItem from "./pages/AddItem";
import EditItem from "./pages/EditItem";
import useGetShopByCity from "./hooks/useGetShopByCity";
import useGetItemsByCity from "./hooks/useGetItemsByCity";
import CardPage from "./pages/CardPage";
import CheckOut from "./pages/CheckOut";
import OrderPlaced from "./pages/OrderPlaced";
import MyOrders from "./pages/MyOrders";
import useGetMyOrders from "./hooks/useGetMyOrders";
import useUpdateLocation from "./hooks/useUpdateLocation";
import TrackOrderPage from "./pages/TrackOrderPage";
import Shop from "./pages/Shop";
import { useEffect } from "react";
import { setSocket } from "./redux/userSlice";
import { io } from "socket.io-client";
import axios from "axios";

export const serverUrl = "https://vingo-backend-rgqt.onrender.com";
const App = () => {

  useGetCurrentUser();
  useGetCity();
 // useGetMyShop();
  useGetShopByCity();
  useGetItemsByCity();
  useUpdateLocation();
  useGetMyOrders();

  // Reads data from the Redux store
  const {userData} = useSelector(state=>state.user)
  const dispatch = useDispatch()

  // socket io
   useEffect(() => {
    if (!userData?._id) return;
    const socketInstance = io(serverUrl, {
  auth: {
    token: localStorage.getItem("token")
  }
});

    dispatch(setSocket(socketInstance))
    socketInstance.on("connect",() => {
      if(userData){
        console.log(userData)
        socketInstance.emit("identity",{userId:userData._id})
      }
    })
    return ()=> {
      socketInstance.disconnect()
    }
  },[userData?._id])




useEffect(() => {
  const interceptor = axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  return () => {
    axios.interceptors.request.eject(interceptor);
  };
}, []);



  return (
    <Routes>
      <Route path="/signup" element={!userData? <SignUp/> : <Navigate to={'/'} />} />
      <Route path="/signin" element={!userData? <SignIn/> : <Navigate to={'/'} />} />
      <Route path="/forgot-password" element={!userData? <ForgotPassword/> : <Navigate to={'/'}/>}/>
      <Route path="/" element={userData? <HomePage/> : <Navigate to={'/signin'}/>}/>
      <Route path="/create-edit-shop" element={userData? <CreateEditShop/> : <Navigate to={'/signin'}/>}/>
      <Route path="/add-item" element={userData? <AddItem/> : <Navigate to={'/signin'}/>}/>
      <Route path="/edit-item/:id" element={userData? <EditItem/> : <Navigate to={'/signin'}/>}/>
      <Route path="/card" element={userData? <CardPage/> : <Navigate to={'/signin'}/>}/>
      <Route path="/checkout" element={userData? <CheckOut/> : <Navigate to={'/signin'}/>}/>
      <Route path="/order-placed" element={userData? <OrderPlaced/> : <Navigate to={'/signin'}/>}/>
      <Route path="/my-orders" element={userData? <MyOrders/> : <Navigate to={'/signin'}/>}/>
      <Route path="/track-order/:orderId" element={userData? <TrackOrderPage/> : <Navigate to={'/signin'}/>}/>
      <Route path="/shop/:shopId" element={userData? <Shop/> : <Navigate to={'/signin'}/>}/>
    </Routes>
  );
};

export default App;
