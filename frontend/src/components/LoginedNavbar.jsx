import React, { useState } from "react";
import { FaStickyNote } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const LoginedNavbar = ({handleSetLogin2,setSearchQuery}) => {
  const navigate = useNavigate();
  
  

  const handleLogout = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("user_id")
    handleSetLogin2();
    window.location.reload();
    navigate("/");
  }

  const handleInput = async (e)=>{
    
    const query = e.target.value;
    setSearchQuery(query);

    
    
  }
  return (
    <div className="w-full h-[100px] bg-cyan-950 shadow-2xl flex items-center justify-evenly">
      <div className="flex gap-5">
        <FaStickyNote className="text-2xl text-white lg:text-3xl"  />{" "}
        <h3 className="hidden font-extrabold text-white lg:text-3xl md:block">Note App</h3>
      </div>
      <div className="relative">
        <FaSearch className="absolute pt-1 text-xl text-black cursor-pointer right-1 top-3" />
        <input className="w-[150px] border-none text-[20px] mt-3 lg:w-[300px] text-xl" type="text" placeholder="Search Notes" onChange={handleInput}/>
      </div>
      <div className="flex gap-8 font-bold text-white text-x lg:text-2xl">
        <Link to="/" className="transition duration-300 ease-in-out hover:text-red-500">
          Home
        </Link>
        <Link to="/notes" className="transition duration-300 ease-in-out hover:text-red-500">
          Add Note
        </Link>
        <Link to="/" className="transition duration-300 ease-in-out hover:text-red-500" onClick={handleLogout}>
          Logout
        </Link>
      </div>
    </div>
  );
};

export default LoginedNavbar;
