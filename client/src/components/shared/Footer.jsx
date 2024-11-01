import React from "react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <div className="bg-primary w-full text-white p-12 md:p-12">
      <div className="text-center md:text-base">
        &copy; {new Date().getFullYear()} Code Collaboration Tool. All rights
        reserved.
      </div>
      <div className="mt-4 flex justify-center space-x-6">
        <a href="https://github.com/deepak007-star" aria-label="Github">
          <FaGithub className="w-6 h-6 hover:text-gray-700 transition duration-200" />
        </a>
        <a
          href="https://www.linkedin.com/in/deepak-pal-774453212/?trk=opento_sprofile_topcard"
          aria-label="Linkedin"
        >
          <FaLinkedin className="w-6 h-6 hover:text-gray-700 transition duration-200" />
        </a>
      </div>
    </div>
  );
};

export default Footer;
