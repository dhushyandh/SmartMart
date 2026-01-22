import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Please enter your email", {
        position: "bottom-right",
      });
    }

    try {
      setLoading(true);

      const response = await axios.post(
        `${backendUrl}/api/password/forgot-password`,
        { email }
      );

      if (!response.data.success) {
        toast.error(response.data.message, {
          position: "bottom-right",
        });
        return;
      }

      toast.success(response.data.message, {
        position: "bottom-right",
      });

      setEmail("");
      navigate("/login");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong",
        { position: "bottom-right" }
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-20 gap-4 text-gray-700"
    >
      <h2 className="text-2xl font-semibold">Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your registered email"
        className="w-full px-3 py-2 border border-gray-800"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white px-8 py-2 mt-4 w-full"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
};

export default ForgotPassword;
