import Navbar from "./Navbar";
import { categories } from "../category";
import CategoryCard from "./CategoryCard";
import { FaChevronCircleLeft } from "react-icons/fa";
import { FaChevronCircleRight } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import FoodCard from "./FoodCard";

const UserDahboard = () => {

  const {city, shopInMyCity, itemsInMyCity} = useSelector(state=>state.user)
  const cateScrollRef = useRef();
  const shopScrollRef = useRef();

  const [showLeftCateBtn, setShowLeftCateBtn] = useState(false);
  const [showRightCateBtn, setShowRightCateBtn] = useState(false);
  const [showRightShopBtn, setShowRightShopBtn] = useState(false);
  const [showLeftShopBtn, setShowLeftShopBtn] = useState(false);

  const updateBtn = (ref, setLeftBtn, setRightBtn) => {
    const element = ref.current;
    if (element) {
      setLeftBtn(element.scrollLeft > 0);
      setRightBtn(
        element.scrollLeft + element.clientWidth < element.scrollWidth
      );
    }
  };

  const scrollhandler = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction == "left" ? -200 : 200,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const el = cateScrollRef.current;
    if (!el) return;

    const handleScroll = () => {
      updateBtn(cateScrollRef, setShowLeftCateBtn, setShowRightCateBtn);
      updateBtn(shopScrollRef, setShowLeftShopBtn, setShowRightShopBtn);
    };

    handleScroll(); 

    el.addEventListener("scroll", handleScroll);

    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="w-full min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto">

      {/* navbar */}
      <Navbar />

      {/* snacks items */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Inspiration for your first order
        </h1>

        <div className="w-full relative">
          {/* left arrow */}
          {showLeftCateBtn && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollhandler(cateScrollRef, "left")}
            >
              <FaChevronCircleLeft />
            </button>
          )}

          {/* images */}
          <div
            className="w-full flex overflow-x-auto gap-4 pb-2"
            ref={cateScrollRef}
          >
            {categories.map((cate, index) => (
              <CategoryCard name={cate.category} image={cate.image} key={index} />
            ))}
          </div>

          {/* right arrow */}
          {showRightCateBtn && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollhandler(cateScrollRef, "right")}
            >
              <FaChevronCircleRight />
            </button>
          )}
        </div>
      </div>
        
      {/* shops */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Best Shop in {city}
        </h1>

          <div className="w-full relative">
          {/* left arrow */}
          {showLeftShopBtn && (
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollhandler(shopScrollRef, "left")}
            >
              <FaChevronCircleLeft />
            </button>
          )}

          {/* images */}
          <div
            className="w-full flex overflow-x-auto gap-4 pb-2"
            ref={shopScrollRef}
          >
            {shopInMyCity?.map((shop, index) => (
              <CategoryCard name={shop.name} image={shop.image} key={index} />
            ))}
          </div>

          {/* right arrow */}
          {showRightShopBtn && (
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10"
              onClick={() => scrollhandler(shopScrollRef, "right")}
            >
              <FaChevronCircleRight />
            </button>
          )}
        </div>
      </div>
      
      {/* Suggested Items */}
      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">
        <h1 className="text-gray-800 text-2xl sm:text-3xl">
          Suggested Food Items
        </h1>

        <div className="w-full h-auto flex flex-wrap gap-[20px] justify-center">
          {itemsInMyCity?.map((item,index) =>(
            <FoodCard key={index} data={item}/>
          ))}
        </div>

      </div>


    </div>
  );
};

export default UserDahboard;
