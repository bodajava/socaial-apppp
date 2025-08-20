import React, { useState, useEffect } from "react";
import styles from "./SignIn.module.css"; 
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import avataer from "../../assets/it.PNG";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import axios from "axios";

export default function SignIn() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      navigate("/Home");
    }
  }, [navigate]);

  const Schema = z.object({
    email: z.string().email("Invalid Email"),
    password: z.string().min(8, "Password must be at least 8 characters")
  });

  const form = useForm({
    defaultValues: {
      email: "",
      password: ""
    },
    resolver: zodResolver(Schema)
  });

  const { register, handleSubmit, formState } = form;

  function handelLogin(values) {
    setIsLoading(true);
    console.log("Login Values:", values);

    axios.post(`https://linked-posts.routemisr.com/users/signin`, values)
      .then((res) => {
        setIsLoading(false);
        if (res.data.message === "success" || res.data.status === "success") {
          const token = res.data.token || res.data.accessToken;
          if (token) {
            localStorage.setItem("userToken", token);
            toast.success("Logged in Successfully!");
            setTimeout(() => {
              navigate("/Home");
            }, 1000);
          } else {
            toast.error("Login failed: No token received");
          }
        } else {
          toast.error(res.data.message || res.data.error || "Login failed");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        let errorMessage = "Network or server error. Please try again.";
        if (err.response && err.response.data) {
          errorMessage = err.response.data.error || err.response.data.message || "Login failed";
        } else if (err.code === "ERR_NETWORK") {
          errorMessage = "Cannot connect to the server. Please check your internet connection.";
        }
        toast.error(errorMessage);
      });
  }

  const ErrorMessage = ({ message }) => (
    <p className="text-red-600 bg-red-100 border border-red-200 rounded-md px-3 py-1 mt-1 text-sm">
      {message}
    </p>
  );

  return (
    <>
      <Toaster position="top-center" richColors />

      <div className={`${styles.container} min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4`}>
        <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-10 rounded-2xl shadow-xl w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img className="w-12 h-12" src={avataer} alt="social icon" />
            <h2 className="text-3xl font-bold text-gray-800">SocialApp</h2>
          </div>
          <h3 className="text-lg text-gray-600 mb-6 text-center">
            Sign In to your account
          </h3>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit(handelLogin)}>
            {/* Email */}
            <input
              {...register("email")}
              type="email"
              placeholder="Email"
              className="p-3 rounded-lg border border-blue-400 text-blue-600 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formState.errors.email && formState.touchedFields.email && (
              <ErrorMessage message={formState.errors.email.message} />
            )}

            {/* Password */}
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="p-3 rounded-lg border border-blue-400 text-blue-600 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formState.errors.password && formState.touchedFields.password && (
              <ErrorMessage message={formState.errors.password.message} />
            )}

            {/* Submit */}
            <button
              disabled={isLoading}
              type="submit"
              className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : "Submit"}
            </button>
          </form>

          {/* Social Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            <button className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition">
              <i className="fa-brands fa-google w-5 h-5 text-red-600"></i>
              <span className="text-sm font-medium text-gray-700">
                Sign in with Google
              </span>
            </button>

            <button className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition">
              <i className="fa-brands fa-facebook w-5 h-5 text-blue-500"></i>
              <span className="text-sm font-medium text-gray-700">
                Sign in with Facebook
              </span>
            </button>
          </div>

          <p className="mt-4 text-sm text-gray-600 text-center">
            Don't have an account?{" "}
            <Link to="/Regester" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}