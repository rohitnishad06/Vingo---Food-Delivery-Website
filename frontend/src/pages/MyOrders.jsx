import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import UserOrdercart from "../components/UserOrdercart";
import OwnerOrderCart from "../components/OwnerOrderCart";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const { userData, myOrders } = useSelector((state) => state.user);
  const navigate = useNavigate()

  return (
    <div className="w-full min-h-screen bg-[#fff9f6] flex justify-center px-4">
      <div className="w-full max-w-[800px] p-4">
        {/* back Arrow */}
        <div className="flex items-center gap-[-20px] mb-6">
          <div className="z-[10]" onClick={() => navigate("/")}>
            <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
          </div>
          {/* Card Text */}
          <h1 className="text-2xl font-bold text0/-start"> My Orders</h1>
        </div>

        <div className="space-y-1">
          {myOrders?.map((order, index) =>(
            userData.role == "user" ? (
              <UserOrdercart data={order} key={index} />
            ): userData.role=="owner" ? (
              <OwnerOrderCart data={order} key={index} />
            ):null
          ))}
        </div>

      </div>
    </div>
  );
};

export default MyOrders;
