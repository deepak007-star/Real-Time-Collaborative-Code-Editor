import React from 'react'
import Navbar from '../shared/Navbar'
import Footer from '../shared/Footer'
import { Link } from 'react-router-dom'

const HomePage = () => {
  return (
    <div>
      <Navbar/>
      <div className="bg-gray-900 text-gray-200 min-h-screen flex flex-col">
      {/* Hero Section */}
      <main className="flex-grow bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900">
        <div className="container mx-auto px-4 flex flex-col items-center justify-center min-h-[80vh]">
          <h1 className="text-5xl md:text-7xl font-extrabold text-center leading-tight text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-blue-500 mb-6">
            Collaborate, Code, and Create in Real-Time
          </h1>
          <p className="text-lg md:text-xl text-center text-gray-400 max-w-3xl mb-8">
            Empower your development team to work on code together, in real time, with live chat, version control, and seamless collaboration.
          </p>
          <div className="flex gap-6">
            <Link
              to="/login"
              className="bg-teal-500 hover:bg-teal-600 text-white py-3 px-8 rounded-md text-lg transition duration-300 transform hover:scale-105"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 rounded-md text-lg transition duration-300 transform hover:scale-105"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center bg-gray-700 rounded-xl shadow-lg p-6 hover:bg-gray-600 transition duration-300 transform hover:scale-105">
            <h3 className="text-xl font-semibold mb-4 text-teal-400">Real-Time Collaboration</h3>
            <p className="text-gray-400">
              Work seamlessly on the same codebase with live updates and collaboration in real time.
            </p>
          </div>
          <div className="text-center bg-gray-700 rounded-xl shadow-lg p-6 hover:bg-gray-600 transition duration-300 transform hover:scale-105">
            <h3 className="text-xl font-semibold mb-4 text-blue-500">Built-In Chat</h3>
            <p className="text-gray-400">
              Keep your communication streamlined with built-in chat functionality within each room.
            </p>
          </div>
          <div className="text-center bg-gray-700 rounded-xl shadow-lg p-6 hover:bg-gray-600 transition duration-300 transform hover:scale-105">
            <h3 className="text-xl font-semibold mb-4 text-teal-400">Version Control</h3>
            <p className="text-gray-400">
              Never lose progress. Track changes and manage versions with ease.
            </p>
          </div>
        </div>
      </section>
      </div>
      <Footer/>
    </div>
  )
}

export default HomePage
