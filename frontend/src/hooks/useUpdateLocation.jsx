import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../App";

const useUpdateLocation = () => {
  const dispatch = useDispatch();
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    const updateLocation = async (lat, lon) => {
      const result = await axios.post(`${serverUrl}/api/user/update-location`, {
        lat,
        lon,
      });
    };

    navigator.geolocation.watchPosition((pos) => {
      updateLocation(pos.coords.latitude, pos.coords.longitude);
    });
  }, [userData]);
};

export default useUpdateLocation;
