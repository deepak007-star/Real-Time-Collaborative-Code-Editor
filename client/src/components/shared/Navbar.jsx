import React from 'react';

const Navbar = () => {
  return (
    <nav className='flex justify-between items-center p-3 bg-primary text-white'>
      <div className='font-poppins pl-7 font-bold text-lg'>DEV-SYNC</div>
      <div className='flex space-x-4 pr-12'>
        <button className='font-poppins hover:text-gray-300 transition duration-200'>
          Log Out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
