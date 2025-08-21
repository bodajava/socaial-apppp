import React, { useState } from "react";
import styles from "./Setting.module.css"; 
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import avataer from "../../assets/it.PNG";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import axios from "axios";

export default function Setting() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Zod schema
  const Schema = z.object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    newPassword: z.string().min(8, "New Password must be at least 8 characters")
  });

  const form = useForm({
    defaultValues: {
      password: "",
      newPassword: ""
    },
    resolver: zodResolver(Schema)
  });

  const { register, handleSubmit, formState } = form;

  async function handelLogin(values) {
    try {
      setIsLoading(true);
      const res = await axios.patch(
        `https://linked-posts.routemisr.com/users/change-password`,
        values,
        {
          headers: {
            token: localStorage.getItem("userToken"),
          },
        }
      );

      if (res.data.message === "success") {
        toast.success("Password updated successfully!");
        localStorage.setItem("userToken", res.data.token);
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to update password");
    } finally {
      setIsLoading(false);
    }
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
            Change your password
          </h3>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit(handelLogin)}>
            {/* Old Password */}
            <input
              {...register("password")}
              type="password"
              placeholder="Current Password"
              className="p-3 rounded-lg border border-blue-400 text-blue-600 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formState.errors.password && (
              <ErrorMessage message={formState.errors.password.message} />
            )}

            {/* New Password */}
            <input
              {...register("newPassword")}
              type="password"
              placeholder="New Password"
              className="p-3 rounded-lg border border-blue-400 text-blue-600 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formState.errors.newPassword && (
              <ErrorMessage message={formState.errors.newPassword.message} />
            )}

            {/* Submit */}
            <button
              disabled={isLoading}
              type="submit"
              className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              {isLoading ? <i className="fa-solid fa-spinner fa-spin"></i> : "Update Password"}
            </button>
          </form>

          <p className="mt-4 text-sm text-gray-600 text-center">
            Back to{" "}
            <Link to="/Regester" className="text-blue-600 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
