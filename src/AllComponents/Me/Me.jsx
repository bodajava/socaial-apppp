import React from 'react'
import Navbar from '../Navbar/Navbar'; 
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import UserPost from '../UserPost/UserPost';

export default function Me() {

  function firUserData() {
    return axios.get(`https://linked-posts.routemisr.com/users/profile-data`, {
      headers: {
        token: localStorage.getItem("userToken")
      }
    })
  }

  let { data, isError, isLoading, error } = useQuery({
    queryKey: ["userData"],
    queryFn: firUserData,
    select: (data) => data?.data?.user
  })

  if (isError) return <p className="text-center mt-10 text-red-500">Error: {error.message}</p>

  return (
    <>
      <div className="flex">
        {/* Sidebar / Navbar */}
        <div className="w-64 bg-white shadow h-screen sticky top-0">
          <Navbar />
        </div>

        {/* Profile Card Fixed */}
        {data && !isLoading && (
          <div className="sticky top-20 self-start mx-6 mt-6 flex justify-center">
            <div className="max-w-sm p-6 bg-white rounded-xl shadow-lg text-center">
              <img 
                src={data.photo} 
                alt={data.name} 
                className="w-28 h-28 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-xl font-bold mb-2">{data.name}</h2>
              <p className="text-gray-700 mb-1"><span className="font-semibold">Email:</span> {data.email}</p>
              <p className="text-gray-700 mb-1"><span className="font-semibold">Gender:</span> {data.gender}</p>
              <p className="text-gray-700 mb-1"><span className="font-semibold">Date of Birth:</span> {new Date(data.dateOfBirth).toLocaleDateString()}</p>
              <p className="text-gray-700 mb-1"><span className="font-semibold">Created At:</span> {new Date(data.createdAt).toLocaleString()}</p>
            </div>
          </div>
        )}

        {/* Loader Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="flex flex-col items-center">
              <div className="w-20 h-20 border-4 border-blue-500 border-dashed rounded-full animate-spin mb-4"></div>
              <p className="text-white text-lg font-semibold">Loading...</p>
            </div>
          </div>
        )}
      </div>

      {data && <UserPost id={data._id} />}
    </>
  )
}
