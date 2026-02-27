import React, { useState } from "react";
import { adminLogin, updateApiKey } from "./api";

function Admin({ goBack }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });
  const [newKey, setNewKey] = useState("");

  const handleLogin = async () => {
    const res = await adminLogin(loginData);
    if (res.data.success) {
      setIsLoggedIn(true);
    } else {
      alert("Invalid Credentials");
    }
  };

  const handleUpdateKey = async () => {
    const res = await updateApiKey({ new_key: newKey });
    alert(res.data.message);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <>
          <h2 className="text-xl font-bold text-center text-red-600 mb-4">
            Admin Login
          </h2>

          <input
            placeholder="Username"
            className="input"
            onChange={(e) =>
              setLoginData({ ...loginData, username: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            className="input"
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />

          <button
            onClick={handleLogin}
            className="w-full bg-red-500 text-white p-3 rounded-lg mt-4"
          >
            Login
          </button>

          <p
            onClick={goBack}
            className="text-center text-gray-500 mt-4 cursor-pointer"
          >
            Back
          </p>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold text-center text-green-600 mb-4">
            Change Gemini API Key
          </h2>

          <input
            placeholder="Enter New API Key"
            className="input"
            onChange={(e) => setNewKey(e.target.value)}
          />

          <button
            onClick={handleUpdateKey}
            className="w-full bg-green-600 text-white p-3 rounded-lg mt-4"
          >
            Update API Key
          </button>

          <button
            onClick={() => setIsLoggedIn(false)}
            className="w-full bg-gray-400 text-white p-2 rounded-lg mt-3"
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}

export default Admin;