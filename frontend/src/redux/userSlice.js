import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userData: null,
    city: null,
    state: null,
    address: null,
    shopInMyCity: null,
    itemsInMyCity: null,
    cardItems:[],
    totalAmount:0,
    myOrders:[]
  },
  reducers: {
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setCity: (state, action) => {
      state.city = action.payload;
    },
    setState: (state, action) => {
      state.state = action.payload;
    },
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    setShopInMyCity: (state, action) => {
      state.shopInMyCity = action.payload;
    },
    setItemsInMyCity: (state, action) => {
      state.itemsInMyCity = action.payload;
    },

    // add item to card
    addToCard: (state, action) => {
      const cardItem = action.payload
      const existingItem = state.cardItems.find(i=>i.id===cardItem.id);
      if(existingItem){
        existingItem.quantity += cardItem.quantity
      }else{
        state.cardItems.push(cardItem)
      }
      state.totalAmount = state.cardItems.reduce((sum,i)=>sum+i.price*i.quantity,0)
    },

    // update the quantity of item
    updateQuantity: (state, action) => {
      const {id, quantity} = action.payload
      const item = state.cardItems.find(i=>i.id===id)
      if(item){
        item.quantity=quantity
      }
      state.totalAmount = state.cardItems.reduce((sum,i)=>sum+i.price*i.quantity,0)
    },

    // remove cart items
    removeCardItem:(state, action) => {
      state.cardItems=state.cardItems.filter(i=>i.id !== action.payload)
      state.totalAmount = state.cardItems.reduce((sum,i)=>sum+i.price*i.quantity,0)
    },

    // myorders
    setMyOrder:(state, action) =>{
      state.myOrders = action.payload
    },

    // for quickly adding orders to my order page
    addMyOrders:(state, action) =>{
      state.myOrders = [action.payload, ...state.myOrders]
    },

    // for quickly updating order status
    updateOrderStatus: (state, action) =>{
      const {orderId, shopId, status} = action.payload
      const order = state.myOrders.find(o=>o._id == orderId) 
      if(order){
        if(order.shopOrders && order.shopOrders.shop._id == shopId){
          order.shopOrders.status = status
        }
      }
    }


  },
});

export const { setUserData, setCity, setState, setAddress, setShopInMyCity, setItemsInMyCity, addToCard, updateQuantity, removeCardItem, setMyOrder,addMyOrders, updateOrderStatus } = userSlice.actions;

export default userSlice.reducer;
