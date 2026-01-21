import React from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CardItemCard from "../components/CardItemCard";

const CardPage = () => {

  const navigate = useNavigate();
  const {cardItems, totalAmount} = useSelector(state=>state.user)

  return (
    <div className="min-h-screen bg-[#fff9f6] flex justify-center p-6">
      <div className="w-full max-w-[800px]">
        <div className="flex items-center gap-[-20px] mb-6">

          {/* back Arrow */}
          <div className="z-[10]" onClick={() => navigate("/")}>
            <IoIosArrowRoundBack size={35} className="text-[#ff4d2d]" />
          </div>
          {/* Card Text */}
          <h1 className="text-2xl font-bold text0/-start">Your Card</h1>
        </div>

        {cardItems?.length == 0 ? (
          <p className="text-gray-500 text-lg text-center">Your Card is Empty</p>
        ):(
          <>
          <div className="space-y-4">
            {cardItems?.map((item, index)=>(
              <CardItemCard data={item} key={index}/>
            ))}
          </div>
          {/* total amount  */}
          <div className="mt-6 bg-white p-4 rounded-xl shadow flex justify-between items-center border">
            <h1 className="text-lg font-semibold">Total Amount</h1>
            <span className="text-xl font-bold text-[#ff4d2d]">{totalAmount}</span>
          </div>
          <div className="mt-4 flex justify-end">
            <button className="bg-[#ff4d2d] text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-[#e64526] transition cursor-pointer" onClick={()=>navigate('/checkout')}> Proceed to CheckOut</button>
          </div>
          </>
          
        )
        }

      </div>
    </div>
  );
};

export default CardPage;
