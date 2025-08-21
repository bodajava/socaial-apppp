import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import avatar from "../../assets/it.png";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const activeClass =
    "bg-blue-100 text-blue-600 p-2 rounded-lg flex items-center gap-3";
  const normalClass =
    "flex items-center gap-3 hover:bg-gray-100 p-2 rounded-lg";

  function handeltoken() {
    localStorage.removeItem("userToken");
    navigate("/Signin");
  }

  useEffect(() => {
    async function getUserData() {
      try {
        let { data } = await axios.get(
          `https://linked-posts.routemisr.com/users/profile-data`,
          {
            headers: { token: localStorage.getItem("userToken") },
          }
        );
        setUser(data.user);
      } catch (error) {
        console.log("Error fetching user data", error);
      }
    }
    getUserData();
  }, []);

  return (
    <>
      {/* شريط علوي على الموبايل */}
      <div className="md:hidden flex items-center justify-between p-4 bg-white border-b fixed top-0 left-0 right-0 z-50">
        <h1 className="text-xl font-bold text-blue-600">SocialApp</h1>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-gray-700 text-2xl focus:outline-none"
        >
          <i className="fa-solid fa-bars"></i>
        </button>
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
            <img
              src={user?.photo || avatar}
              alt="user avatar"
              className="w-10 h-10 rounded-full object-cover border"
            />
            <div>
              <p className="font-semibold">{user?.name || "Guest"}</p>
              <p className="text-gray-500 text-sm">
                @{user?.email?.split("@")[0] || "unknown"}
              </p>
            </div>
          </div>

          {/* قائمة التنقل */}
          <nav className="flex flex-col gap-4 text-gray-700">
            <NavLink to="/home" className={({ isActive }) => (isActive ? activeClass : normalClass)} onClick={() => setIsOpen(false)}>
              <i className="fa-solid fa-house"></i> Home
            </NavLink>
            <NavLink to="/explore" className={({ isActive }) => (isActive ? activeClass : normalClass)} onClick={() => setIsOpen(false)}>
              <i className="fa-solid fa-compass"></i> Explore
            </NavLink>
            <NavLink to="/notifications" className={({ isActive }) => (isActive ? activeClass : normalClass)} onClick={() => setIsOpen(false)}>
              <i className="fa-solid fa-bell"></i> Notifications
            </NavLink>
            <NavLink to="/messages" className={({ isActive }) => (isActive ? activeClass : normalClass)} onClick={() => setIsOpen(false)}>
              <i className="fa-regular fa-message"></i> Messages
            </NavLink>
            <NavLink to="/Me" className={({ isActive }) => (isActive ? activeClass : normalClass)} onClick={() => setIsOpen(false)}>
              <i className="fa-regular fa-user"></i> Profile
            </NavLink>
            <NavLink to="/Setting" className={({ isActive }) => (isActive ? activeClass : normalClass)} onClick={() => setIsOpen(false)}>
              <i className="fa-solid fa-key"></i> Forgit Password
            </NavLink>
            <NavLink to="/bookmarks" className={({ isActive }) => (isActive ? activeClass : normalClass)} onClick={() => setIsOpen(false)}>
              <i className="fa-regular fa-bookmark"></i> Bookmarks
            </NavLink>
          </nav>
        </div>

        {/* أسفل الصفحة */}
        <div className="flex flex-col gap-4">
          <NavLink to="/CreatPost" className="bg-blue-600 text-white text-center py-2 rounded-full font-semibold hover:bg-blue-700 transition" onClick={() => setIsOpen(false)}>
            + Create Post
          </NavLink>
          <button onClick={handeltoken} className="flex items-center gap-2 text-gray-700 hover:bg-gray-100 p-2 rounded-lg">
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </div>

      {/* Overlay للموبايل */}
      {isOpen && (
        <div className="fixed inset-0 bg-black opacity-30 z-40 md:hidden" onClick={() => setIsOpen(false)}></div>
      )}

      {/* مسافة لعدم اختفاء المحتوى تحت شريط الموبايل */}
      <div className="md:hidden h-16"></div>
    </>
  );
}
