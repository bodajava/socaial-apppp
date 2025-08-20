import React, { useState } from "react";
import styles from "./Regester.module.css"; 
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "sonner";
import avataer from "../../assets/it.png";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from '@hookform/resolvers/zod';
import axios from "axios";

export default function Regester() {
  const navigate = useNavigate();
  const [isLoading , setisLoading] = useState(false)

  const Schema = z
    .object({
      name: z.string().min(3, "Name is required").max(15, "Max length is 15 characters"),
      email: z.string().email("Invalid Email"),
      password: z
        .string()
        .regex(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%&*-]).{8,}$/,
          "Must include 1 capital letter, 1 number, 1 special char and min 8 chars"
        ),
      rePassword: z.string(),
      dateOfBirth: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
        .refine(date => new Date(date) < new Date(), "Invalid date"), 
      gender: z.enum(["male", "female"], "Gender must be male or female"),
    })
    .refine(data => data.password === data.rePassword, {
      message: "Password and confirm password do not match",
      path: ["rePassword"],
    });

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    resolver: zodResolver(Schema)
  });

  const { register, handleSubmit, formState } = form;

  function handelRegester(values) {
    setisLoading(true)
    console.log("Form Values:", values);

    axios.post(`https://linked-posts.routemisr.com/users/signup`, values)
      .then((res) => {
        if(res.data.message === "success") {
          setisLoading(false)
          toast.success("Registered Successfully!");

         
          setTimeout(() => {
            navigate("/signin");
          }, 1000);
        } else {
          toast.error(res.data.message || "Registration failed");
        }
      })
      .catch((err) => {
        if(err.response && err.response.data) {
          const serverMessage = err.response.data.error || err.response.data.message || "Registration failed";
          toast.error(serverMessage);
          
        } else {
          toast.error("Network or server error. Please try again.");
        }
                  setisLoading(false)

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

      <div
        className={`${styles.container} min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4`}
      >
        <div className="bg-white/90 backdrop-blur-sm p-6 sm:p-10 rounded-2xl shadow-xl w-full max-w-md">
          <div className="flex items-center justify-center gap-3 mb-6">
            <img className="w-12 h-12" src={avataer} alt="social icon" />
            <h2 className="text-3xl font-bold text-gray-800">SocialApp</h2>
          </div>
          <h3 className="text-lg text-gray-600 mb-6 text-center">
            Create an Account
          </h3>

          <form className="flex flex-col gap-4" onSubmit={handleSubmit(handelRegester)}>
            {/* Name */}
            <input
              {...register("name")}
              type="text"
              placeholder="Full Name"
              className="p-3 rounded-lg border border-blue-400 text-blue-600 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formState.errors.name && formState.touchedFields.name && (
              <ErrorMessage message={formState.errors.name.message} />
            )}

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

            {/* Confirm Password */}
            <input
              {...register("rePassword")}
              type="password"
              placeholder="Confirm Password"
              className="p-3 rounded-lg border border-blue-400 text-blue-600 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formState.errors.rePassword && formState.touchedFields.rePassword && (
              <ErrorMessage message={formState.errors.rePassword.message} />
            )}

            {/* Date of Birth */}
            <input
              {...register("dateOfBirth")}
              type="date"
              className="p-3 rounded-lg border border-blue-400 text-blue-600 placeholder-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formState.errors.dateOfBirth && formState.touchedFields.dateOfBirth && (
              <ErrorMessage message={formState.errors.dateOfBirth.message} />
            )}

            {/* Gender */}
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 text-blue-600">
                <input {...register("gender")} type="radio" value="male" />
                Male
              </label>
              <label className="flex items-center gap-2 text-blue-600">
                <input {...register("gender")} type="radio" value="female" />
                Female
              </label>
            </div>
            {formState.errors.gender && formState.touchedFields.gender && (
              <ErrorMessage message={formState.errors.gender.message} />
            )}

            {/* Submit */}
            <button
            disabled={isLoading}
              type="submit"
              className="bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
            >
              
              {isLoading ? <i class="fa-solid fa-spinner fa-spin fa-spin-reverse"></i> : "Submite"}
            </button>
          </form>

          {/* Social Buttons */}
          <div className="mt-6 flex flex-col gap-3">
            <button className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition">
              <i className="fa-brands fa-google w-5 h-5 text-red-600"></i>
              <span className="text-sm font-medium text-gray-700">
                Sign up with Google
              </span>
            </button>

            <button className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition">
              <i className="fa-brands fa-facebook w-5 h-5 text-blue-500"></i>
              <span className="text-sm font-medium text-gray-700">
                Sign up with Facebook
              </span>
            </button>
          </div>
          <p className="mt-4 text-sm text-gray-600 text-center">
            Already have an account?{" "}
            <Link to="/Signin" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
