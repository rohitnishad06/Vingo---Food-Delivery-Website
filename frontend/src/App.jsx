import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import SignUp from "./pages/signUp";
import SignIn from "./pages/signIn";
import ForgotPassword from "./pages/ForgotPassword";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import { useSelector } from "react-redux";
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

export const serverUrl = "http://localhost:8000";
const App = () => {

  useGetCurrentUser();
  useGetCity();
 // useGetMyShop();
  useGetShopByCity();
  useGetItemsByCity();


  // Reads data from the Redux store
  const {userData} = useSelector(state=>state.user)

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
    </Routes>
  );
};

export default App;
