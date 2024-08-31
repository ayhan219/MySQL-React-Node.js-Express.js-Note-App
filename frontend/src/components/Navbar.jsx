import React from "react";
import { FaStickyNote } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="w-full h-[100px] bg-cyan-950 shadow-2xl flex items-center justify-evenly ">
      <div className="flex gap-5">
        <FaStickyNote className="text-2xl text-white lg:text-3xl" />{" "}
        <h3 className="hidden font-extrabold text-white lg:text-3xl md:block">Note App</h3>
      </div>
      <div className="relative">
        <FaSearch className="absolute pt-1 text-xl text-black cursor-pointer right-1 top-3" />
        <input className="w-[150px] border-none text-[20px] mt-3 lg:w-[300px] text-xl" type="text" placeholder="Search Notes" />
      </div>
      <div className="flex gap-8 font-bold text-white text-x lg:text-2xl">
        <Link to="/" className="transition duration-300 ease-in-out hover:text-red-500">
          Home
        </Link>
        <Link to="/login" className="transition duration-300 ease-in-out hover:text-red-500">
          Login
        </Link>
        <Link to="/signup" className="transition duration-300 ease-in-out hover:text-red-500">
          Signup
        </Link>
      </div>
    </div>
  );
};

export default Navbar;
