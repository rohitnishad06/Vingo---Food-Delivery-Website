import React from 'react'
import { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;   // important

    const fetchUser = async () => {
      try {
        const result = await axios.get(
          `${serverUrl}/api/user/current`
        );

        dispatch(setUserData(result.data));
      } catch (error) {
        localStorage.removeItem("token");  // invalid token cleanup
        dispatch(setUserData(null));
      }
    };

    fetchUser();
  }, []);
};


export default useGetCurrentUser;