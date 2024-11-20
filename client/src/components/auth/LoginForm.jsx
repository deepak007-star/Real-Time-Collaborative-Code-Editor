import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/axios";
import {useDispatch} from 'react-redux'

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async(e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill out both fields.");
      return;
    }
    setError("");
    try {
      const response =await login(email, password);
      const {user, token} = response
      localStorage.setItem("token",token)
      dispatch(login({
        user, token
      }))
      if(token){
        navigate('/dashboard')
      }
    } catch (error) {
      setError(`${error.message}`)
    }
  };

  return (
    <>
    <div className="bg-gray-900 min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto bg-[#19222f] p-8 rounded-xl shadow-xl">
          <h2 className="text-3xl font-semibold text-center text-white mb-6">Login to Your Account</h2>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your password"
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm mb-4">
                <span>{error}</span>
              </div>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-teal-500 text-white rounded-md text-lg hover:bg-teal-600 transition duration-300 transform hover:scale-105"
            >
              Login
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-gray-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-teal-400 hover:text-teal-500">
                Sign up here
              </Link>
            </p>
            <p className="text-gray-400 mt-2">
              <Link to="/forgot-password" className="text-teal-400 hover:text-teal-500">
                Forgot Password?
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default LoginForm;
