import userModel from "./models/userModel.js";

export const socketHandler = async (io) => {
  io.on("connection", (socket) => {
    socket.on("identity", async ({ userId }) => {
      try { 
        const user = await userModel.findByIdAndUpdate(
          userId,
          {
            socketId: socket.id,
            isOnline: true,
          },
          { new: true },
        );
      } catch (error) {
        console.log(error);
      }
    });

    socket.on("updateLocation", async({latitude, longitude, userId}) => {
      try {
        const user = await userModel.findByIdAndUpdate(userId,{
          location:{
            type:'Point',
            coordinates:[longitude, latitude]
          },
          isOnline:true,
          socketId:socket.id
        })

        if(user){
          io.emit("updateDeliveryLocation",{
            deliveryBoyId:userId,
            latitude,longitude 
          })
        }

        
      } catch (error) {
        console.log(error);
      }
    })

    socket.on('disconnect', async() =>{
      try {
        await userModel.findOneAndUpdate({socketId:socket.id},{

            socketId: null,
            isOnline: false,          
        })
      } catch (error) {
        console.log(error)
      }
    })

  });
};
