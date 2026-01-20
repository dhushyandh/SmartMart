import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { backendUrl, token } = useContext(ShopContext);

  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  /* ===== LOAD PROFILE ===== */
  useEffect(() => {
    const loadProfile = async () => {
      const res = await axios.post(
        backendUrl + "/api/user/profile",
        {},
        { headers: { token } }
      );

      if (res.data.success) {
        setUser(res.data.user);
      }
    };
    loadProfile();
  }, []);

  /* ===== UPDATE PROFILE ===== */
  const updateProfile = async () => {
    const res = await axios.put(
      backendUrl + "/api/user/profile/update",
      user,
      { headers: { token } }
    );

    if (res.data.success) toast.success("Profile Updated");
  };

  /* ===== CHANGE PASSWORD ===== */
  const changePassword = async () => {
    const res = await axios.put(
      backendUrl + "/api/user/profile/password",
      passwordData,
      { headers: { token } }
    );

    if (res.data.success) toast.success("Password Updated");
    else toast.error(res.data.message);
  };

  return (
    <div className="max-w-xl mx-auto mt-12">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Name"
        value={user.name}
        onChange={(e) => setUser({ ...user, name: e.target.value })}
      />

      <input
        className="border p-2 w-full mb-2"
        placeholder="Phone"
        value={user.phone}
        onChange={(e) => setUser({ ...user, phone: e.target.value })}
      />

      <textarea
        className="border p-2 w-full mb-2"
        placeholder="Address"
        value={user.address}
        onChange={(e) => setUser({ ...user, address: e.target.value })}
      />

      <button
        onClick={updateProfile}
        className="bg-black text-white px-6 py-2 mt-2"
      >
        Update Profile
      </button>

      <hr className="my-6" />

      <h3 className="text-xl font-medium mb-2">Change Password</h3>

      <input
        type="password"
        className="border p-2 w-full mb-2"
        placeholder="Old Password"
        onChange={(e) =>
          setPasswordData({ ...passwordData, oldPassword: e.target.value })
        }
      />

      <input
        type="password"
        className="border p-2 w-full mb-2"
        placeholder="New Password"
        onChange={(e) =>
          setPasswordData({ ...passwordData, newPassword: e.target.value })
        }
      />

      <button
        onClick={changePassword}
        className="bg-black text-white px-6 py-2"
      >
        Change Password
      </button>
    </div>
  );
};

export default MyProfile;
