import React from "react";

const Navbar = () => {
  return (
    <nav className="w-full flex items-center justify-between px-8 py-4 text-white">

      {/* Logo */}
      <div className="text-xl font-bold">
        Career Mentor
      </div>

      {/* Navigation Links */}
      <ul className="flex gap-8">
        <a href="#home" className="cursor-pointer hover:text-gray-300">Home</a>
        <a href="#features" className="cursor-pointer hover:text-gray-300">Features</a>
        <a href="#works" className="cursor-pointer hover:text-gray-300">How it Works</a>
        <a href="#testimonial" className="cursor-pointer hover:text-gray-300">Testimonials</a>
      </ul>

      {/* Auth Buttons */}
      <div className="flex gap-4 items-center">
        <button className="hover:text-gray-300">Sign In</button>
        <button className="from-purple-700 to-blue-600 bg-linear-to-l px-4 py-2 rounded-lg hover:bg-blue-600">
          Get Started
        </button>
      </div>

    </nav>
  );
};

export default Navbar;