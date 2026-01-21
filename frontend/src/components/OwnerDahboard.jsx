import React from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import { FaUtensils } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import OwnerItemCard from "../pages/OwnerItemCard";
import useGetMyShop from "../hooks/useGetMyShop";

const OwnerDahboard = () => {
  useGetMyShop();
  const { myShopData } = useSelector((state) => state.owner);
  const navigate = useNavigate();

  return (
    <div>
      <Navbar />

      {/* add shop  */}
      {!myShopData && (
        <div className="flex justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add Your Shop
              </h2>
              <p className="text-gray-400 mb-4 text-sm sm:text-base">
                Join our food delivery Platform and reach thousands of hunger
                customers every day.
              </p>

              {/* get started btn */}
              <button
                className="bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200"
                onClick={() => navigate("/create-edit-shop")}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* shop details card */}
      {myShopData && (
        <div className="w-full flex flex-col items-center gap-6 px-4 sm:px-6">
          <h1 className="text-2xl sm:text-3xl text-gray-900 flex items-center gap-3 mt-8 text-center">
            <FaUtensils className="text-[#ff4d2d] w-14 h-14" /> Welcome To {myShopData.name}
          </h1>

          <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-orange-100 hover:shadow-2xl transition-all duration-300   w-full max-w-3xl relative">
            {/* Edit Icon */}
            <div className="absolute top-4 right-4 bg-[#ff4d2d] text-white p-2 rounded-full shadow-md hover:bg-orange-600 transition-colors cursor-pointer" onClick={() => navigate("/create-edit-shop")}>
              <FaPen size={20}/>
            </div>

            {/* Shop Img */}
            <img src={myShopData.image} alt={myShopData.name} className="w-full h-48 sm:h-64 object-cover"/>

            {/* Shop Detail */}
            <div className="p-4 sm:p-6">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{myShopData.name}</h1>
              <p className="text-gray-500">{myShopData.city}</p>
              <p className="text-gray-500 mb-4">{myShopData.address}</p>
            </div>

          </div>

          {/* add food items card */}
          {myShopData.items.length == 0 && 
          <div className="flex justify-center items-center p-4 sm:p-6">
          <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col items-center text-center">
              <FaUtensils className="text-[#ff4d2d] w-16 h-16 sm:w-20 sm:h-20 mb-4" />
              <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                Add Your Food Item
              </h2>
              <p className="text-gray-400 mb-4 text-sm sm:text-base">
                Share your delicious creations with our customers by adding them to the menu.
              </p>

              {/* get started btn */}
              <button
                className="bg-[#ff4d2d] text-white px-5 sm:px-6 py-2 rounded-full font-medium shadow-md hover:bg-orange-600 transition-colors duration-200"
                onClick={() => navigate("/add-item")}
              >
                Add Food
              </button>
            </div>
          </div>
          </div>
          }

          {/* showing all the items */}
          {myShopData.items.length>0 && 
            <div className="flex flex-col items-center gap-4 w-full max-w-3xl">
              {myShopData.items.map((item, index) => (
                <OwnerItemCard data={item} key={index}/>
              ))}
            </div>}

        </div>
      )}

    </div>
  );
};

export default OwnerDahboard;
