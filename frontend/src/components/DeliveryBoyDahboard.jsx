import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import DeliveryBoyTracking from "./DeliveryBoyTracking";
import { setUserData } from "../redux/userSlice";

const DeliveryBoyDahboard = () => {
  const { userData, socket } = useSelector((state) => state.user);
  const [availableAssignments, setAvailableAssignments] = useState([]);
  const [currentOrder, setCurrentOrder] = useState();
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");
  const [deliveryBoyLocation, setDeliveryBoyLocation] = useState(null)
  const [otpSending, setOtpSending] = useState(false);

  // get orders
  const getCurrentOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-current-order`,
        { withCredentials: true },
      );
      console.log(result.data);
      setCurrentOrder(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // get assignment
  const getAssignments = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/order/get-assignments`, {
        withCredentials: true,
      });
      console.log(result.data);
      setAvailableAssignments(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // accept order
  const acceptOrder = async (assignmentId) => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/accept-order/${assignmentId}`,
        { withCredentials: true },
      );
      console.log(result.data);
      await getCurrentOrder();
    } catch (error) {
      console.log(error);
    }
  };

  // send otp
  const sendOtp = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/send-delivery-otp`,
        { orderId: currentOrder._id, shopOrderId: currentOrder.shopOrder._id },
        { withCredentials: true },
      );
      console.log(result.data);
      setShowOtpBox(true);  
      setShowOtpBox(true);
    } catch (error) {
      console.log(error);
    }finally {
    setOtpSending(false);  // re-enable button after API finishes
  }
  };

  // verify otp
  const verifyOtp = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/order/verify-delivery-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp,
        },
        { withCredentials: true },
      );
      console.log(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  // socket io
  // handle real time delivery assignment
  useEffect(() => {
    if (!socket || !userData?._id) return;

    const handleDeliveryAssignment = (data) => {
      if (data.sendTo === userData._id) {
        setAvailableAssignments((prev) => [...prev, data]);
      }
    };

    socket?.on("newAssignment", handleDeliveryAssignment);

    return () => {
      socket.off("newAssignment", handleDeliveryAssignment);
    };
  }, [socket, userData?._id]);

  // socket io
  // handle real time traccking
  useEffect(() => {
    if (!socket || userData?.role !== "deliveryBoy") return;

    let watchId;
    if (navigator.geolocation) {
      ((watchId = navigator.geolocation.watchPosition((position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        setDeliveryBoyLocation({lat:latitude, lon:longitude})
        socket.emit("updateLocation", {
          latitude,
          longitude,
          userId: userData?._id,
        });
      })),
        (error) => {
          console.log(error);
        },
        {
          enableHighAccuracy: true,
        });
    }

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, userData?._id]);

  useEffect(() => {
    getAssignments();
    getCurrentOrder();
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">
      <Navbar />

      <div className="w-full max-w-[800px] flex flex-col gap-5 items-center">
        {/* Delivery Boy details */}
        <div className="bg-white rounded-2xl shadow-md p-5 flex-col justify-start items-center w-[90%] border border-orange-100 text-center gap-2">
          <h1 className="text-xl font-bold text-[#ff4d2d]">
            Welcome, {userData.fullName}
          </h1>
          <p className="text-[#ff4d2d]">
            <span className="font-semibold">Latitute :</span>{" "}
            {deliveryBoyLocation?.lat ||userData.location.coordinates[1]},{" "}
            <span className="font-semibold">Longitude : </span>{" "}
            {deliveryBoyLocation?.lon || userData.location.coordinates[0]}
          </p>
        </div>

        {/* available orders */}
        {!currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            <h1 className="text-lg font-bold mb-4 flex items-center gap-2">
              Available Orders
            </h1>
            <div className="space-y-4">
              {availableAssignments.length > 0 ? (
                availableAssignments.map((a, index) => (
                  <div
                    className="border rounded-lg p-4 flex justify-between items-center"
                    key={index}
                  >
                    <div>
                      {console.log(a.deliveryAddress)}
                      <p className="text-sm font-semibold">{a?.shopName}</p>
                      <p className="text-sm text-gray-500">
                        <span className="font-semibold">
                          Delivery Address :
                        </span>{" "}
                        {a?.deliveryAddress.text}
                      </p>
                      <p className="text-xs text-gray-400">
                        {a.items.length} items | {a.subTotal}{" "}
                      </p>
                    </div>
                    <button
                      className="bg-orange-500 text-white px-4 py-1 rounded-lg text-sm hover:bg-orange-600"
                      onClick={() => acceptOrder(a.assignmentId)}
                    >
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-sm">No Available Orders</p>
              )}
            </div>
          </div>
        )}

        {/* current Orders */}
        {currentOrder && (
          <div className="bg-white rounded-2xl p-5 shadow-md w-[90%] border border-orange-100">
            <h2 className="text-lg font-semibold mb-3">Current Order </h2>
            <div className="border rounded-lg p-4 mb-3">
              <p className="font-semibold text-sm">
                {currentOrder.shopOrder.shop.name}
              </p>
              <p className="text-sm text-gray-500">
                {currentOrder.deliveryAddress?.text}
              </p>
              <p className="text-xs text-gray-400">
                {currentOrder.shopOrder.shopOrderItems.length} items |{" "}
                {currentOrder.shopOrder.subTotal}
              </p>
            </div>
            <DeliveryBoyTracking
              data={{
                deliveryBoyLocation: deliveryBoyLocation || {
                  lat: userData.location?.coordinates[1],
                  lon: userData.location?.coordinates[0],
                },
                customerLocation: {
                  lat: currentOrder.deliveryAddress.latitude,
                  lon: currentOrder.deliveryAddress.longitude,
                },
              }}
            />

            {!showOtpBox ? (
              <button
                disabled={otpSending}
                className="mt-4 w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-green-600 active:scale-95 transition-all duration-200"
                onClick={sendOtp}
              >
                {otpSending ? "Sending OTP..." : "Mark As Delivered"}
              </button>
            ) : (
              <div className="mt-2 p-4 border border-xl rounded-xl bg-gray-50">
                <p className="text-sm font-semibold mb-2">
                  Enter OTP Send To{" "}
                  <span className="text-orange-500">
                    {currentOrder.user.fullName}
                  </span>{" "}
                </p>
                <input
                  type="text"
                  className="w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  placeholder="Enter OTP"
                  onChange={(e) => setOtp(e.target.value)}
                  value={otp}
                />
                <button
                  className="mt-4 w-full bg-orange-500 text-white font-semibold py-2 px-4 rounded-xl shadow-md hover:bg-orange-600 active:scale-95 transition-all duration-200"
                  onClick={verifyOtp}
                >
                  Submit OTP
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryBoyDahboard;
