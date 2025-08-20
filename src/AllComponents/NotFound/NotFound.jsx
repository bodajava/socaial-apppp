import React from "react";
import { useNavigate } from "react-router-dom";
import avataer from "../../assets/it.PNG"; 
import styles from "./NotFound.module.css"; // استدعاء ملف CSS

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={`${styles.container} relative flex flex-col items-center justify-center min-h-screen text-center px-6`}>
      
      {/* طبقة شفافة عشان النص يبان فوق الخلفية */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* المحتوى */}
      <div className="relative z-10 flex flex-col items-center">
        {/* صورة افاتار */}
        <img
          src={avataer}
          alt="Avatar"
          className="w-24 h-24 rounded-full shadow-lg mb-6 border-4 border-white/70"
        />

        {/* الرقم 404 */}
        <h1 className="text-6xl sm:text-7xl font-bold text-white drop-shadow-lg">
          404
        </h1>

        {/* العنوان */}
        <h2 className="text-xl sm:text-2xl text-white mt-4">
          Page Not Found
        </h2>

        {/* الوصف */}
        <p className="text-white/80 mt-2 max-w-md">
          The page you are looking for doesn’t exist or may have been moved.  
          Try searching for something else or return to the home page.
        </p>

        {/* مربع البحث */}
        <div className="mt-6 w-full max-w-md px-2">
          <input
            type="text"
            placeholder="Search for something else..."
            className="w-full p-3 rounded-xl shadow-md focus:outline-none focus:ring-2 focus:ring-white"
          />
        </div>

        {/* زر العودة */}
        <button
          onClick={() => navigate("/")}
          className="mt-6 px-6 py-3 bg-white text-blue-600 font-semibold rounded-xl shadow-md hover:bg-gray-100 transition"
        >
          Return to Home
        </button>

        {/* روابط تحت */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-white/80 text-sm">
          <a href="#" className="hover:text-white">About</a>
          <a href="#" className="hover:text-white">Help</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
}
