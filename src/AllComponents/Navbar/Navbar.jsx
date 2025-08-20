import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import avatar from "../../assets/it.png";
import {  useNavigate } from "react-router-dom";



export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()

  const activeClass = "bg-blue-100 text-blue-600 p-2 rounded-lg flex items-center gap-3";
  const normalClass = "flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg";

function handeltoken (){
  localStorage.removeItem("userToken")
  navigate("/Signin")
}


  return (
    <>
      <div className="md:hidden flex items-center p-4 bg-white border-b">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 text-2xl focus:outline-none"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
        <h1 className="ml-4 text-xl font-bold text-blue-600">SocialApp</h1>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white border-r p-6 flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:flex
          z-50
        `}
      >
        {/* شعار التطبيق */}
        <div>
          <h1 className="text-2xl font-bold text-blue-600 mb-8 hidden md:block">
            SocialApp
          </h1>

          {/* بيانات المستخدم */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              JD
            </div>
            <div>
              <p className="font-semibold">John Doe</p>
              <p className="text-gray-500 text-sm">@johndoe</p>
            </div>
          </div>

          {/* قائمة التنقل */}
          <nav className="flex flex-col gap-4 text-gray-700">
            <NavLink
              to="/home"
              className={({ isActive }) => (isActive ? activeClass : normalClass)}
              onClick={() => setIsOpen(false)}
            >
              <i className="fa-solid fa-house"></i>
              Home
            </NavLink>

            <NavLink
              to="/explore"
              className={({ isActive }) => (isActive ? activeClass : normalClass)}
              onClick={() => setIsOpen(false)}
            >
              <i className="fa-solid fa-compass"></i>
              Explore
            </NavLink>

            <NavLink
              to="/notifications"
              className={({ isActive }) => (isActive ? activeClass : normalClass)}
              onClick={() => setIsOpen(false)}
            >
              <i className="fa-solid fa-bell"></i>
              Notifications
            </NavLink>

            <NavLink
              to="/messages"
              className={({ isActive }) => (isActive ? activeClass : normalClass)}
              onClick={() => setIsOpen(false)}
            >
              <i className="fa-regular fa-message"></i>
              Messages
            </NavLink>

            <NavLink
              to="/Me"
              className={({ isActive }) => (isActive ? activeClass : normalClass)}
              onClick={() => setIsOpen(false)}
            >
              <i className="fa-regular fa-user"></i>
              Profile
            </NavLink>

            <NavLink
              to="/Setting"
              className={({ isActive }) => (isActive ? activeClass : normalClass)}
              onClick={() => setIsOpen(false)}
            >
              <i className="fa-solid fa-gear"></i>
              Settings
            </NavLink>

            <NavLink
              to="/bookmarks"
              className={({ isActive }) => (isActive ? activeClass : normalClass)}
              onClick={() => setIsOpen(false)}
            >
              <i className="fa-regular fa-bookmark"></i>
              Bookmarks
            </NavLink>
          </nav>
        </div>

        {/* أسفل الصفحة */}
        <div className="flex flex-col gap-4">
          <button className="bg-blue-600 text-white py-2 rounded-full font-semibold hover:bg-blue-700 transition">
            + Create Post
          </button>
          <button onClick={handeltoken} className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-lg">
            <i className="fa-solid fa-right-from-bracket"></i>
            Logout
          </button>
        </div>
      </div>

      {/* Overlay للشاشات الصغيرة */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}
