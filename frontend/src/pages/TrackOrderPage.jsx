import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import { IoIosArrowRoundBack } from "react-icons/io";
import DeliveryBoyTracking from "../components/DeliveryBoyTracking";
import { useSelector } from "react-redux";

const TrackOrderPage = () => {
  const { socket } = useSelector((state) => state.user);
  const { orderId } = useParams();
  const [currentOrder, setCurentOrder] = useState();
  const [liveLocation, setLiveLocation] = useState({});
  const navigate = useNavigate();

  const handleGetOrder = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/order/get-order-by-id/${orderId}`
      );
      setCurentOrder(result.data);
    } catch (error) {
      console.log(error);
    }
  };


  // socket io
  useEffect(() => {
    if (!socket) return;

    const handleUpdateDeliveryBoyLocation = ({
      deliveryBoyId,
      latitude,
      longitude,
    }) => {
      setLiveLocation((prev) => ({
        ...prev,
        [deliveryBoyId]: { lat: latitude, lon: longitude },
      }));
    };

    socket.on("updateDeliveryLocation", handleUpdateDeliveryBoyLocation);

    return () => {
      socket.off("updateDeliveryLocation", handleUpdateDeliveryBoyLocation);
    };
  }, [socket]);


  useEffect(() => {
    handleGetOrder();
  }, [orderId]);

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6">
      {/* Back Arrow */}
      <div className="flex items-center gap-[-20px] mb-6">
        <div className="z-[10]" onClick={() => navigate("/")}>
          <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
        </div>
        {/* Card Text */}
        <h1 className="text-2xl font-bold text0/-start"> Track Orders</h1>
      </div>

      {currentOrder?.shopOrders?.map((shopOrder, index) => (
        <div
          className="bg-white p-4 rounded-2xl shadow-md border border-orange-100 space-y-4"
          key={index}
        >
          <div>
            <p className="text-lg font-bold mb-2 text-[#ff4d2d]">
              {shopOrder.shop.name}
            </p>
            <p className="font-semibold">
              <span>Items: </span>
              {shopOrder?.shopOrderItems?.map((i) => i.name).join(", ")}
            </p>
            <p>
              <span className="font-semibold">SubTotal: </span>
              {shopOrder.subTotal}
            </p>
            <p className="mt-6">
              <span className="font-semibold">Delivery Address : </span>
              {currentOrder.deliveryAddress.text}
            </p>
          </div>

          {shopOrder.status !== "delivered" ? (
            <>
              {shopOrder.assignedDeliveryBoy ? (
                <div className="text-sm text-gray-700">
                  <p className="font-semibold">
                    <span>Delivery Boy Name : </span>
                    {shopOrder.assignedDeliveryBoy.fullName}
                  </p>
                  <p className="font-semibold">
                    <span>Delivery Boy Contact No. : </span>
                    {shopOrder.assignedDeliveryBoy.mobile}
                  </p>
                </div>
              ) : (
                <p className="font-semibold">
                  Delivery boy is not assigned yet.
                </p>
              )}
            </>
          ) : (
            <p className="text-green-600 font-semibold text-lg">Delivered</p>
          )}

          {shopOrder.assignedDeliveryBoy && shopOrder.status != "delivered" && (
            <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md">
              <DeliveryBoyTracking
                data={{
                  deliveryBoyLocation: liveLocation[
                    shopOrder.assignedDeliveryBoy._id
                  ] || {
                    lat: shopOrder.assignedDeliveryBoy?.location?.coordinates[1],
                    lon: shopOrder.assignedDeliveryBoy?.location?.coordinates[0],
                  },
                  customerLocation: {
                    lat: currentOrder.deliveryAddress.latitude,
                    lon: currentOrder.deliveryAddress.longitude,
                  },
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TrackOrderPage;
