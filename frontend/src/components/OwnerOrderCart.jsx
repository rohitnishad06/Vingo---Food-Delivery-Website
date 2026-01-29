import React from "react";
import { FaPhone } from "react-icons/fa6";

const OwnerOrderCart = ({ data }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 space-y-4">
      {/* Customer details */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800">
          {data.user.fullName}
        </h2>
        <p className="text-sm text-gray-500">{data.user.email}</p>
        <p className="flex items-center gap-2 text-sm text-gray-600 mt-1">
          <FaPhone />
          <span>{data.user.mobile}</span>
        </p>
      </div>

      {/* delivery address */}
      <div className="flex items-start flex-col gap-2 text-gray-600 text-sm">
        <p>{data?.deliveryAddress?.text}</p>
        <p className="text-xs text-gray-500">
          Lat: {data.deliveryAddress.latitude}, Lon:{" "}
          {data.deliveryAddress.longitude}
        </p>
      </div>

      {/* items */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {data.shopOrders.shopOrderItems.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-40 border rounded-lg p-2 bg-white"
          >
            <img
              src={item.item.image}
              alt=""
              className="w-full h-24 object-cover rounded"
            />
            <p className="text-sm font-semibold mt-1">{item.name}</p>
            <p className="text-xs text-gray-500">
              {" "}
              Qyt: {item.quantity} x ₹{item.item.price}
            </p>
          </div>
        ))}
      </div>

      {/* order status */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
        <span className="text-sm">Status: <span className="font-semibold capitalize text-[#ff4d2d]">{data.shopOrders.status}</span></span>

        <select value={data.shopOrders.status} className="rounded-md border px-3 py-1 text-sm focus:oultine-none focus:ring-2 border-[#ff4d2d] text-[#ff4d2d]"> 
          <option value="pending">Pending</option>
          <option value="preparing">Preparing</option>
          <option value="out of delivery">Out of Delivery</option>
        </select>

      </div>

      {/* total  */}
      <div className="text-right font-bold text-gray-800 text-sm">
        Total: ₹{data.shopOrders.subTotal}
      </div>

    </div>
  );
};

export default OwnerOrderCart;
