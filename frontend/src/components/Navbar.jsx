import React, { useEffect, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { CiSearch } from "react-icons/ci";
import { FiShoppingCart } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { serverUrl } from "../App";
import { setSearchitems, setUserData } from "../redux/userSlice";
import { TbReceiptRupee } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { userData, city, cardItems } = useSelector((state) => state.user);
  const { myShopData } = useSelector((state) => state.owner);
  const [showInfo, setShowInfo] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState("")
  const dispatch = useDispatch();
  const navigate = useNavigate()

  if (!userData) return null;

  const handleLogout = () => {
  localStorage.removeItem("token");
  dispatch(setUserData(null));
  navigate("/signin");
};

    // search handler
    const handleSearchitems = async() => {
      try {
        const result = await axios.get(`${serverUrl}/api/item/search-items?query=${query}&city=${city}`)
        dispatch(setSearchitems(result.data));
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
      if(query){
        handleSearchitems();
      }else{
        dispatch(setSearchitems(null));
      }

    },[query])

  return (
    <div className="w-full h-[80px] flex items-center justify-between md:justify-center gap-[30px] px-[20px] fixed top-0 left-0 z-[9999] bg-[#fff9f6] shadow-sm">
      {/* small screen search box */}
      {showSearch && userData?.role == "user" && (
        <div className="w-[90%] h-[50px] bg-white shadow-lg rounded-full items-center px-4 border border-gray-100 flex fixed top-[80px] left-[5%]">
          {/* Location Section */}
          <div className="flex items-center w-[30%] border-r-2 border-gray-300 pr-2 gap-2 cursor-pointer">
            <FaLocationDot size={20} className="text-[#ff4d2d] shrink-0" />
            <span className="truncate text-gray-600 font-medium text-sm">
              {city}
            </span>
          </div>

          {/* Input Field Section */}
          <div className="flex items-center flex-1 pl-4 gap-2">
            <CiSearch size={22} className="text-[#ff4d2d]" />
            <input
              type="text"
              placeholder="Search delicious food..."
              className="w-full text-gray-700 outline-none bg-transparent placeholder-gray-400"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>
        </div>
      )}

      {/* Logo */}
      <h1 className="text-3xl font-bold text-[#ff4d2d] cursor-pointer">
        Vingo
      </h1>

      {/* Search Container */}
      {userData?.role == "user" && (
        <div className="hidden md:flex md:w-[60%] lg:w-[40%] h-[50px] bg-white shadow-lg rounded-full items-center px-4 border border-gray-100">
          {/* Location Section */}
          <div className="flex items-center w-[30%] border-r-2 border-gray-300 pr-2 gap-2 cursor-pointer">
            <FaLocationDot size={20} className="text-[#ff4d2d] shrink-0" />
            <span className="truncate text-gray-600 font-medium text-sm">
              {city}
            </span>
          </div>

          {/* Input Field Section */}
          <div className="flex items-center flex-1 pl-4 gap-2">
            <CiSearch size={22} className="text-[#ff4d2d]" />
            <input
              type="text"
              placeholder="Search delicious food..."
              className="w-full text-gray-700 outline-none bg-transparent placeholder-gray-400"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
            />
          </div>
        </div>
      )}

      {/* Right Side Icons */}
      <div className="flex items-center gap-4">
        {/* small screen Search Icon */}
        {userData?.role == "user" &&
          (showSearch ? (
            <RxCross2
              size={25}
              className="text-[#ff4d2d] md:hidden cursor-pointer"
              onClick={() => setShowSearch(false)}
            />
          ) : (
            <CiSearch
              size={25}
              className="text-[#ff4d2d] md:hidden cursor-pointer"
              onClick={() => setShowSearch(true)}
            />
          ))}

        {/* add food btn */}
        {userData?.role == "owner"? <>

        {myShopData && <>
        <button className="hidden md:flex items-center gap-1 p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]" onClick={()=>navigate('/add-item')}>
          <FaPlus size={20} />
          <span>Add Food Item</span>
        </button>
        <button className="md:hidden flex items-center p-2 cursor-pointer rounded-full bg-[#ff4d2d]/10 text-[#ff4d2d]" onClick={()=>navigate('/add-item')}>
          <FaPlus size={20} />
        </button>
        </>}
        
          {/* my order btn owner */}
          <div className="hidden md:flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium" onClick={()=>navigate('/my-orders')}>
            <TbReceiptRupee size={20}/>
            <span>My Orders</span>
            
          </div>
          <div className="md:hidden flex items-center gap-2 cursor-pointer relative px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] font-medium" onClick={() => navigate('/my-orders')}>
            <TbReceiptRupee size={20}/>
            
          </div>

        </> : (
          <>
          {/* Cart */}
          {userData?.role == "user" &&
          <div className="relative cursor-pointer" onClick={()=>navigate('/card')}>
            <FiShoppingCart size={25} className="text-[#ff4d2d]" />
            <span className="absolute right-[-9px] top-[-12px] text-[#ff4d2d]">
              {cardItems?.length}
            </span>
          </div>
          }
          

        {/* my Order user Btn */}
        <button className="hidden md:block px-3 py-1 rounded-lg bg-[#ff4d2d]/10 text-[#ff4d2d] text-sm font-medium" onClick={()=>navigate('/my-orders')}>
          My Orders
        </button>
          </>
        )}

        {/* profile */}
        <div
          className="w-[40px] h-[40px] rounded-full flex items-center justify-center bg-[#ff4d2d] text-white text-[18px] shadow-xl font-semibold cursor-pointer"
          onClick={() => setShowInfo((prev) => !prev)}
        >
          {userData?.fullName ? userData?.fullName[0] : "U"}
        </div>

        {/* User Info Popup */}
        {showInfo && (
          <div className={`fixed top-[80px] right-[10px] ${userData?.role == "deliveryBoy" ? "md:right-[20%] lg:right-[35%]":"md:right-[10%] lg:right-[25%]"} w-[180px] bg-white shadow-2xl rounded-xl p-[20px] flex flex-col gap-[10px] z-[9999]`}>
            <div className="text-[17px] font-semibold">{userData?.fullName}</div>
            {userData?.role=="user" && <div className="md:hidden text-[#ff4d2d] font-semibold cursor-pointer" onClick={()=>navigate('/my-orders')}>
              My Orders
            </div>}
            
            <div
              className="text-[#ff4d2d] font-semibold cursor-pointer"
              onClick={handleLogout}
            >
              Log Out
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Navbar;
