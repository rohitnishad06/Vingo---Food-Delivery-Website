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
    totalAmount:0
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
    removeCardItem:(state, action) => {
      state.cardItems=state.cardItems.filter(i=>i.id !== action.payload)
      state.totalAmount = state.cardItems.reduce((sum,i)=>sum+i.price*i.quantity,0)
    }
  },
});

export const { setUserData, setCity, setState, setAddress, setShopInMyCity, setItemsInMyCity, addToCard, updateQuantity, removeCardItem } = userSlice.actions;

export default userSlice.reducer;
