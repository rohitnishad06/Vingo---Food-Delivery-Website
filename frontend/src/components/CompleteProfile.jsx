import React, { useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch, useSelector } from "react-redux";
import { setUserData } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useEffect } from "react";

const CompleteProfile = () => {
  const primaryColor = "#ff4d2d";
  const hoverColor = "#e64323";
  const bgColor = "#fff9f6";
  const borderColor = "#ddd";

  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!userData) {
      navigate("/signin");
    }
  }, [userData]);

  const [fullName, setFullName] = useState(userData?.fullName || "");
  const [mobile, setMobile] = useState("");
  const [role, setRole] = useState(userData?.role || "user");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // 🔒 Validation Function
  const validateForm = () => {
    if (!fullName.trim()) return "Full Name is required";
    if (!mobile.trim()) return "Mobile number is required";
    if (!/^[6-9]\d{9}$/.test(mobile))
      return "Enter a valid 10-digit Indian mobile number";
    if (!role) return "Please select a role";
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        `${serverUrl}/api/auth/complete-profile`,
        { fullName, mobile, role },
      );

      dispatch(setUserData(data));
      navigate("/", { replace: true });
    } catch (err) {
      setError(err?.response?.data?.msg || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 border-[1px]"
        style={{ border: `1px solid ${borderColor}` }}
      >
        <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
          Complete Profile
        </h1>

        <p className="text-gray-600 mb-8">
          Just a few more details to start your Vingo journey 🍔
        </p>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
          />
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-1">Mobile</label>
          <input
            type="text"
            placeholder="Enter your mobile number"
            className="w-full rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500"
            style={{ border: `1px solid ${borderColor}` }}
            onChange={(e) => setMobile(e.target.value)}
            value={mobile}
          />
        </div>

        {/* Role */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Select Role
          </label>

          <div className="flex gap-2">
            {["user", "owner", "deliveryBoy"].map((r) => (
              <button
                key={r}
                type="button"
                className="flex-1 rounded-lg px-3 py-2 text-center font-medium transition duration-200 cursor-pointer"
                onClick={() => setRole(r)}
                style={
                  role === r
                    ? { backgroundColor: primaryColor, color: "white" }
                    : {
                        border: `1px solid ${primaryColor}`,
                        color: primaryColor,
                      }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mb-4">* {error}</p>}

        {/* Save Button */}
        <button
          className="w-full font-semibold py-2 rounded-lg transition duration-200 text-white cursor-pointer flex items-center justify-center"
          style={{ backgroundColor: primaryColor }}
          onMouseOver={(e) =>
            (e.currentTarget.style.backgroundColor = hoverColor)
          }
          onMouseOut={(e) =>
            (e.currentTarget.style.backgroundColor = primaryColor)
          }
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <ClipLoader size={20} color="white" /> : "Save & Continue"}
        </button>
      </div>
    </div>
  );
};

export default CompleteProfile;
