import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { MdMyLocation } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";

const CheckOut = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fff9f6] flex items-center justify-center p-6">
      <div
        className="absolute top-[20px] left-[20px] z-[10]"
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
      </div>

      <div className="w-full max-w-[900px] bg-white rounded-2xl shadow-xl p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">CheckOut</h1>
        <section>
          <h2 className="text-lg font-semibold mb--2 flex items-center gap-2 text-gray-800">
            <FaLocationDot className="text-[#ff4d2d]" />
            Delivery Loaction
          </h2>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              name=""
              id=""
              className=" flex-1 border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
              placeholder="Enter Your Delivery Address..."
            />
            <button className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center">
              <IoIosSearch size={17}/>
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center">
              <MdMyLocation size={17}/>
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CheckOut;
