import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/axios";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const handleRegister = async(e) => {
    e.preventDefault();
    if (!email || !username || !password || !confirmPassword) {
      setError("Please fill out all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError("");
    setLoading(true)
    console.log(email, password);
    
    try {
      const data = await register(email, username, password);
      if(data){
        navigate('/login')
      }
      setLoading(false)
    } catch (error) {
      setError(`${error.message}`)
    }
  };

  return (
    <>
    {loading?
      <div>
      loading...</div>
    :
    (<div className="bg-gray-900 min-h-screen flex flex-col justify-center">
      <div className="container mx-auto px-4 py-10">
        <div className="max-w-md mx-auto bg-[#19222f] p-8 rounded-xl shadow-xl">
          <h2 className="text-3xl font-semibold text-center text-white mb-6">Create Your Account</h2>
          <form onSubmit={handleRegister}>
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
            <div className="mb-4">
              <label htmlFor="username" className="block text-gray-300 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-4">
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
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Confirm your password"
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
              Register
            </button>
          </form>
          <div className="text-center mt-4">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link to="/login" className="text-teal-400 hover:text-teal-500">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>)}
    </>
  );
};

export default RegisterForm;
