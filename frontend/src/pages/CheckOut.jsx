import React, { useEffect, useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { MdDescription, MdMyLocation } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import "leaflet/dist/leaflet.css";
import { setDeliveryAddress, setLocation } from "../redux/mapSlice";
import axios from "axios";
import { MdDeliveryDining } from "react-icons/md";
import { FaMobile } from "react-icons/fa";
import { FaRegCreditCard } from "react-icons/fa";
import { serverUrl } from "../App";
import { addMyOrders } from "../redux/userSlice";

const CheckOut = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addressInput, setAddressInput] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");


  const apiKey = import.meta.env.VITE_GEOAPIKEY;

  const { location, address } = useSelector((state) => state.map);
  const { cardItems,totalAmount, userData } = useSelector((state) => state.user);
  const deliveryFee = totalAmount>500?0:40;
  const amountWithDeliveryFee = totalAmount + deliveryFee

  // handle place Order
  const handlePlaceOrder = async() =>{
    try {
      const result = await axios.post(`${serverUrl}/api/order/place-order`,{
        paymentMethod, 
        deliveryAddress:{
          text:addressInput,
          latitude:location.lat,
          longitude:location.lon
        },
        totalAmount,
        cardItems
    },{withCredentials:true})
    if(paymentMethod == "cod"){
      dispatch(addMyOrders(result.data))
      navigate('/order-placed')
    }else{
      const orderId = result.data.orderId;
      const razorOrder = result.data.razorOrder
      handleRazorpayWindow(orderId, razorOrder);
    }
    
    } catch (error) {
      console.log(error)
    }
  }

  // handle razorpay window 
  const handleRazorpayWindow =(orderId, razorOrder) => {

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: razorOrder.amount,
      currency: 'INR',
      name:"Vingo",
      Description:"Food Delivery Website",
      order_id: razorOrder.id,
      handler: async function name(response) {
        try {
          const result = await axios.post(`${serverUrl}/api/order/verify-payment`,{
            razorpay_payment_id : response.razorpay_payment_id,
            orderId
          },{withCredentials:true})
          dispatch(addMyOrders(result.data))
          navigate('/order-placed')
        } catch (error) {
          console.log(error)
        }
      }
    }
   
    const rzp = new window.Razorpay(options)
    rzp.open()

  }


  // Recenter the map
  function ReCenterMap({ location }) {
    if (location.lat && location.lon) {
      const map = useMap();
      map.setView([location.lat, location.lon], 16, { animate: true });
    }
    return null;
  }

  // handle the drag marker
  const onDragEnd = (e) => {
    console.log(e.target._latlng);
    const { lat, lng } = e.target._latlng;
    dispatch(setLocation({ lat, lon: lng }));
    getAddressByLatLng(lat, lng);
  };

  // current location
  const getCurrentLocation = () => {
      const latitude = userData.location.coordinates[1]
      const longitude = userData.location.coordinates[0]
      dispatch(setLocation({ lat: latitude, lon: longitude }));
      getAddressByLatLng(latitude, longitude);
  };

  // get address by drag marker lat lon
  const getAddressByLatLng = async (lat, lng) => {
    try {
      const apiKey = import.meta.env.VITE_GEOAPIKEY;
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lng}&format=json&apiKey=${apiKey}`,
      );
      console.log(result?.data?.results[0].address_line2);
      dispatch(setDeliveryAddress(result?.data?.results[0].address_line2));
    } catch (error) {
      console.log(error);
    }
  };

  // set location by input
  const getLatLongByAddress = async () => {
    try {
      const result = await axios.get(
        `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(addressInput)}&apiKey=${apiKey}`,
      );
      const { lat, lon } = result.data.features[0].properties;
      dispatch(setLocation({ lat, lon }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setAddressInput(address);
  }, [address]);

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
        {/* location */}
        <section>
          <h2 className="text-lg font-semibold mb--2 flex items-center gap-2 text-gray-800">
            <FaLocationDot className="text-[#ff4d2d]" />
            Delivery Loaction
          </h2>
          {/* delivery loaction box */}
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              name=""
              id=""
              className=" flex-1 border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#ff4d2d]"
              placeholder="Enter Your Delivery Address..."
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
            />
            {/* search location btn */}
            <button className="bg-[#ff4d2d] hover:bg-[#e64526] text-white px-3 py-2 rounded-lg flex items-center justify-center">
              <IoIosSearch size={17} onClick={getLatLongByAddress} />
            </button>
            {/* my location btn */}
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center justify-center">
              <MdMyLocation size={17} onClick={getCurrentLocation} />
            </button>
          </div>

          {/* map */}
          <div className="rounded-xl border overflow-hidden">
            <div className="h-64 w-full flex items-center justify-center">
              <MapContainer
                center={[location?.lat, location?.lon]}
                zoom={13}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <ReCenterMap location={location} />
                <Marker
                  position={[location?.lat, location?.lon]}
                  draggable
                  eventHandlers={{ dragend: onDragEnd }}
                />
              </MapContainer>
            </div>
          </div>
        </section>

        {/* payment */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">
            Payment Method
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* COD */}
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${paymentMethod === "cod" ? "border-[#fff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray-300"}`}
              onClick={() => setPaymentMethod("cod")}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <MdDeliveryDining className="text-green-600 text-xl" />
              </span>
              <div>
                <p className="font-medium text-gray-800">Cash On Delivery</p>
                <p className="text-xs text-gray-500">
                  pay when your food arrives
                </p>
              </div>
            </div>
            {/* Online */}
            <div
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition ${paymentMethod === "online" ? "border-[#fff4d2d] bg-orange-50 shadow" : "border-gray-200 hover:border-gray-300"}`}
              onClick={() => setPaymentMethod("online")}
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                <FaMobile className="text-purple-700 text-lg" />
              </span>
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                <FaRegCreditCard className="text-blue-700 text-lg" />
              </span>
              <div>
                <p className="font-medium text-gray-800">UPI / Debit / Credit Card</p>
                <p className="text-xs text-gray-500">Pay Securely Online</p>
              </div>
            </div>
          </div>
        </section>

        {/* Order Summary */}
        <section>
          <h2 className="text-lg font-semibold mb-3 text-gray-800">Order Summary</h2>
          <div className="rounded-xl border bg-gray-50 p-4 space-y-2">
            {cardItems.map((item,index) => (
              <div key={index} className="flex justify-between text-sm text-gray-700">
                <span>{item.name} X {item.quantity}</span>
                <span>₹{item.price*item.quantity}</span>
              </div>
            ))}
            <hr className="border-gray-200 my-2"/>
            <div className="flex justify-between font-medium text-gray-800">
              <span>Subtotal</span>
              <span>{totalAmount}</span>
            </div>
            <div className="flex justify-between font-medium text-gray-700">
              <span>Delivery Fee</span>
              <span>{deliveryFee==0?"Free":deliveryFee}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#ff4d2d] pt-2">
              <span>Total</span>
              <span>{amountWithDeliveryFee}</span>
            </div>
          </div>
        </section>
        
        {/* place order Btn */}
        <button className="w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl font-semibold" onClick={handlePlaceOrder}>
          {paymentMethod=="cod"?"Place Order":"Pay & Place order"}</button>
      </div>
    </div>
  );
};

export default CheckOut;
