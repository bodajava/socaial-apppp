import React, { useState } from 'react';
import Navbar from '../Navbar/Navbar'; 
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import UserPost from '../UserPost/UserPost';
import CreatePost from '../CreatPost/CreatPost';

export default function Me() {
  const [preview, setPreview] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formstat = useForm({
    defaultValues: {
      photo: ""
    }
  });

  const { register, handleSubmit, reset } = formstat;

  function handelaplodphoto(value) {
    const myData = new FormData();
    myData.append("photo", value?.photo[0]);
    
    axios.put(`https://linked-posts.routemisr.com/users/upload-photo`, myData, {
      headers: { token: localStorage.getItem("userToken") }
    })
    .then((res) => {
      console.log("Uploaded:", res.data);
      setIsModalOpen(false);
      reset();
      setPreview(null);
    })
    .catch((err) => {
      console.log("Error:", err?.response?.data?.error || err.message);
    });
  }

  function firUserData() {
    return axios.get(`https://linked-posts.routemisr.com/users/profile-data`, {
      headers: { token: localStorage.getItem("userToken") }
    });
  }

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["userData"],
    queryFn: firUserData,
    select: (res) => res?.data?.user
  });
console.log(data);

  if (isError) return <p className="text-center mt-10 text-red-500">Error: {error.message}</p>;

  return (
    <>
      <div className="flex">
        <div className=" h-screen sticky top-0">
          <Navbar />
        </div>

        <div className="flex-1 p-6">
          {data && !isLoading && (
            <>
              <div className="max-w-sm p-6 bg-white rounded-xl shadow-lg text-center mx-auto mb-6">
                <img 
                  src={data.photo} 
                  alt={data.name} 
                  className="w-28 h-28 rounded-full mx-auto mb-4 object-cover"
                />
                <h2 className="text-xl font-bold mb-2">{data.name}</h2>
                <p className="text-gray-700 mb-1"><span className="font-semibold">Email:</span> {data?.email}</p>
                <p className="text-gray-700 mb-1"><span className="font-semibold">name:</span> {data?.name}</p>
                <p className="text-gray-700 mb-1"><span className="font-semibold">gender:</span> {data?.gender}</p>
                <p className="text-gray-700 mb-1"><span className="font-semibold">date  s:</span> {data?.dateOfBirth}</p>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Change your photo
                </button>
              </div>

              {/* Form إنشاء البوست */}
              <CreatePost userId={data._id} />

              {/* عرض منشورات المستخدم */}
              <UserPost id={data._id} />
            </>
          )}

          {isLoading && (
            <div className="flex justify-center items-center h-64">
              <p>Loading...</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal رفع الصورة */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 relative">
            <h2 className="text-xl font-bold mb-4">Upload New Photo</h2>
            <form onSubmit={handleSubmit(handelaplodphoto)} className="flex flex-col gap-4">
              <input 
                type="file" 
                {...register("photo")}
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setPreview(URL.createObjectURL(file));
                }}
              />

              {preview && (
                <div className="flex justify-center">
                  <img src={preview} alt="Preview" className="w-32 h-32 object-cover rounded-full" />
                </div>
              )}

              <div className="flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => { setIsModalOpen(false); reset(); setPreview(null); }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Upload
                </button>



              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
