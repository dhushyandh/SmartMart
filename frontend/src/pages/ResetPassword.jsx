import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters", {
        position: "bottom-right",
      });
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match", {
        position: "bottom-right",
      });
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${backendUrl}/api/password/reset/${token}`,
        { password }
      );

      if (response.data.success) {
        toast.success("Password reset successful. Please login.", {
          position: "bottom-right",
        });
        navigate("/login");
      } else {
        toast.error(response.data.message || "Invalid or expired token", {
          position: "bottom-right",
        });
      }
    } catch (error) {
      toast.error("Reset link expired or invalid", {
        position: "bottom-right",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-20 gap-4 text-gray-700"
    >
      <h2 className="text-2xl font-semibold">Reset Password</h2>

      <input
        type="password"
        placeholder="New Password"
        className="w-full px-3 py-2 border border-gray-800"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Confirm Password"
        className="w-full px-3 py-2 border border-gray-800"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-8 py-2 mt-4 w-full"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
};

export default ResetPassword;
