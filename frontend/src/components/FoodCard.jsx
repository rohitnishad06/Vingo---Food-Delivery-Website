import React from 'react'
import { useState } from 'react';
import { FaLeaf } from "react-icons/fa";
import { FaDrumstickBite } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCard } from '../redux/userSlice';

const FoodCard = ({data}) => {

  const [quantity, setQuantity] = useState(0);
  const dispatch = useDispatch()
  const {cardItems} = useSelector(state=>state.user)

  // star function
  const renderStarts = (rating) =>{
    const star = [];
    for (let i = 0; i < 5; i++) {
      star.push(
        (i<=rating)?(
          <FaStar className='text-yellow-500 text-lg' />
        ):(<FaRegStar className='text-yellow-500 text-lg'/>)
      )
    }
    return star;
  }

  // function for increse Number in card
  const handleIncreases = () =>{
    const newQwt = quantity+1;
    setQuantity(newQwt);
  }

  // function for increse Number in card
  const handleDecreses = () =>{
    if(quantity>0){
      const newQwt = quantity-1;
      setQuantity(newQwt);
    }
  }

  // add to card
    const handleAddToCart = () => {
    if (quantity === 0) return;
    dispatch(
      addToCard({
        id: data._id,
        name: data.name,
        price: data.price,
        foodType: data.foodType,
        shop: data.owner,
        quantity,
        image: data.image,
      })
    );
  };

  return (
    <div className='w-[250px] rounded-2xl border-2 border-[#ff4d2d] bg-white shaddow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col'>

      {/* image & icon */}
      <div className='relative w-full h-[170px] flex justify-center items-center bg-white'>
        <div className='absolute top-3 right-3 bg-white rounded-full p-1 shadow'>
          {data.foodType=="veg"?<FaLeaf className='text-green-600 text-lg'/>:<FaDrumstickBite className='text-red-600 text-lg' />}
        </div>
        
        <img src={data.image} alt="" className='w-full h-full object-cover transition-transform  duration-300 hover:scale-105'/>
      </div>

      <div className='flex-1 flex flex-col p-4'>
        <h1 className='font-semibold text-gray-900 text-base truncate'>{data.name}</h1>

        {/* rating */}
        <div className='flex items-center mt-1 gap-1'>
          {renderStarts(data.rating?.average || 0)}
          <span className='text-xs text-gray-500'>
            {data.rating?.count || 0}
          </span>
        </div>

        {/* pricing & card */}
        <div className='flex items-center justify-between mt-auto pt-3'>

          {/* price */}
          <span className='font-bold txt-gra-900 text-lg'>
            {data.price}
          </span>

          {/* card */}
          <div className='flex items-center border rounded-full overflow-hidden shadow-sm'>
            {/* - icon */}
            <button className='px-2 py-1 hover:bg-gray-100 transition' onClick={handleDecreses}>
              <FaMinus size={12}/>
            </button>
            <span>{quantity}</span>
            {/* + icon */}
            <button className='px-2 py-1 hover:bg-gray-100 transition' onClick={handleIncreases}>
              <FaPlus size={12}/>
            </button>
            {/* card icon */}
            <button className={`${cardItems.some(i=>i.id==data._id)?"bg-gray-800":"bg-[#ff4d2d]"} text-white px-3 py-2 transition-colors disabled:opacity-50`} disabled={quantity===0} onClick={handleAddToCart}><FaShoppingCart size={16} /></button>
          </div>

        </div>

      </div>

    </div>
  )
}

export default FoodCard