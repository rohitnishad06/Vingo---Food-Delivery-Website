import React, { useState } from "react";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { ClipLoader } from "react-spinners"

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate();

  //Send Otp
  const handleSendOtp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        { email },
        { withCredentials: true }
      );
      console.log(result);
      setStep(2);
      setErr("");
      setLoading(false)
    } catch (error) {
      setErr(error?.response?.data?.msg || "Something went wrong");
      setLoading(false)
    }
  };

  //Verify Otp
  const handleVerifyOtp = async () => {
    setLoading(true)
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        { email, otp },
        { withCredentials: true }
      );
      console.log(result);
      setStep(3);
      setErr("");
      setLoading(false)
    } catch (error) {
     setErr(error?.response?.data?.msg || "Something went wrong");
     setLoading(false)
    }
  };

  //Reset Password
  const handleResetPassword = async () => {
    setLoading(true)
    if (newPassword != confirmPassword) {
      return null;
    }
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        { email, newPassword },
        { withCredentials: true }
      );
      console.log(result);
      navigate("/signin");
      setErr("");
      setLoading(false)
    } catch (error) {
      setErr(error?.response?.data?.msg || "Something went wrong");
      setLoading(false)
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 w-full bg-[#fff9f6]">
      <div className={`bg-white rounded-xl shadow-lg w-full max-w-md p-8`}>
        <div className="flex items-center gap-4 mb-4">
          <IoIosArrowRoundBack
            size={30}
            className="text-[#ff4d2d] cursor-pointer"
            onClick={() => navigate("/signin")}
          />
          <h1 className="text-2xl font-bold text-center text-[#ff4d2d]">
            Forgot Password
          </h1>
        </div>

        {/* Step 1 */}
        {step == 1 && (
          <div>
            {/* Email */}
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
              >
                Email
              </label>
              <input
                type="email"
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter your Email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
              />
            </div>

            {/* OTP Btn */}
            <button
              className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`}
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading?<ClipLoader size={20} color="white"/>:"Send OTP"}
            </button>
            {err && <p className="text-red-500 text-center my-[10px]">*{err}</p>}
          </div>
        )}

        {/* Step 2 */}
        {step == 2 && (
          <div>
            {/* OTP */}
            <div className="mb-6">
              <label
                htmlFor="otp"
                className="block text-gray-700 font-medium mb-1"
              >
                OTP
              </label>
              <input
                type="tel"
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter OTP"
                onChange={(e) => setOtp(e.target.value)}
                value={otp}
                required
              />
            </div>

            {/* Verify Btn */}
            <button
              className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`}
              onClick={handleVerifyOtp}
              disabled={loading}
            >
             {loading?<ClipLoader size={20} color="white"/>:"Verify OTP"}
            </button>
            {err && <p className="text-red-500 text-center my-[10px]">*{err}</p>}
          </div>
        )}

        {/* Step 3 */}
        {step == 3 && (
          <div>
            {/* New password */}
            <div className="mb-6">
              <label
                htmlFor="otp"
                className="block text-gray-700 font-medium mb-1"
              >
                New Password
              </label>
              <input
                type="password"
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Enter New Password"
                onChange={(e) => setNewPassword(e.target.value)}
                value={newPassword}
                required
              />
            </div>

            {/* Confirm password */}
            <div className="mb-6">
              <label
                htmlFor="otp"
                className="block text-gray-700 font-medium mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full border-[1px] border-gray-200 rounded-lg px-3 py-2 focus:outline-none"
                placeholder="Confirm Password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              />
            </div>

            {/* reset Btn */}
            <button
              className={`w-full font-semibold py-2 rounded-lg transition duration-200 bg-[#ff4d2d] text-white hover:bg-[#e64323] cursor-pointer`}
              onClick={handleResetPassword}
              disabled={loading}
            >
              {loading?<ClipLoader size={20} color="white"/>:"Reset Password"}
            </button>

            {err && <p className="text-red-500 text-center my-[10px]">*{err}</p>}
          
          </div>
        )}

      </div>
    </div>
  );
};

export default ForgotPassword;
