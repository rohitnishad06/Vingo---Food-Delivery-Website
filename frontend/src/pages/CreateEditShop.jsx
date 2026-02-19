import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUtensils } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { setMyShopData } from "../redux/ownerSlice";
import { ClipLoader } from "react-spinners";

const CreateEditShop = () => {

  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { myShopData } = useSelector((state) => state.owner);
  const { city, state, address } = useSelector((state) => state.user);

  const [Name, setName] = useState(myShopData?.name || "");
  const [City, setCity] = useState(myShopData?.city || city);
  const [State, setState] = useState(myShopData?.state || state);
  const [Address, setAddress] = useState(myShopData?.address || address);
  const [frontendImg, setFrontendImg] = useState(myShopData?.image || null);
  const [backendImg, setBackendImg] = useState(null);
  const [loading, setLoading] = useState(false)

  const handleImg = (e) => {
    const file = e.target.files[0];
    setBackendImg(file);
    setFrontendImg(URL.createObjectURL(file));
  };

  const handleSubmit = async(e) =>{
    e.preventDefault()
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("name",Name)
      formData.append("city",City)
      formData.append("state",State)
      formData.append("address",Address)
      if(backendImg){
        formData.append("image",backendImg)
      }
      const result = await axios.post(`${serverUrl}/api/shop/create-edit`, formData)
      dispatch(setMyShopData(result.data))
      setLoading(false)
      navigate('/')
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center flex-col items-center p-6 bg-gradient-to-br from-orange-50 relative to-white min-h-screen">
      {/* back Arrow */}
      <div
        className="absolute top-[20px] left-[20px] z-[10] mb-[10px]"
        onClick={() => navigate("/")}
      >
        <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
      </div>

      <div className="max-w-lg w-full bg-white shadow-xl rounded-2xl p-8 border border-orange-100">
        {/* add shop text and Icon */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full mb-4">
            <FaUtensils className="text-[#ff4d2d] w-16 h-16" />
          </div>
          <div className="text-3xl font-extrabold text-gray-900">
            {myShopData ? "Edit Shop" : "Add Shop"}
          </div>
        </div>

        {/* form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              placeholder="Enter Shop Name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setName(e.target.value)}
              value={Name}
            />
          </div>

          {/* img upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Shop Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={handleImg}
            />
            {frontendImg && (
              <div className="mt-4">
                <img
                  src={frontendImg}
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>
            )}
          </div>

          {/* state & city  */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State
              </label>
              <input
                type="text"
                placeholder="State"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                onChange={(e) => setState(e.target.value)}
                value={State}
              />
            </div>

            {/* city */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                City
              </label>
              <input
                type="text"
                placeholder="City"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                onChange={(e) => setCity(e.target.value)}
                value={City}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              placeholder="Enter Shop Address"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              onChange={(e) => setAddress(e.target.value)}
              value={Address}
            />
          </div>

          {/* Save Btn */}
          <button className="w-full bg-[#ff4d2d] text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:bg-orange-600 hover:shadow-lg transition-all duration-200 cursor-pointer" disabled={loading}>
            {loading?<ClipLoader size={20} color="white"/>:"Save"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEditShop;
