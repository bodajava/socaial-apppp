import { useForm } from "react-hook-form";
import React from "react";
import axios from "axios";
import { toast, Toaster } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreatePost({ userId }) {
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      body: "",
      image: "",
    },
  });

  const { register, handleSubmit, reset } = form;

  const mutation = useMutation({
    mutationFn: (myData) => axios.post(`https://linked-posts.routemisr.com/posts`, myData, {
      headers: { token: localStorage.getItem("userToken") },
    }),
    onSuccess: () => {
      toast.success("Post created successfully!");
      reset();
      queryClient.invalidateQueries(["userPost", userId]);
    },
    onError: () => {
      toast.error("Failed to create post!");
    },
  });

  function handedlAddPost(values) {
    const myData = new FormData();
    myData.append("body", values.body);
    if (values.image?.[0]) myData.append("image", values.image[0]);

    mutation.mutate(myData);
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6 mb-6">
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit(handedlAddPost)}>
        <input
          {...register("body")}
          type="text"
          placeholder="What's on your mind?"
          className="w-full p-3 border rounded-xl mb-4"
        />

        <label className="block w-full border-2 border-dashed rounded-xl p-4 text-center text-gray-500 cursor-pointer mb-4">
          <input {...register("image")} type="file" className="hidden" />
          Click to upload an image
        </label>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl">
          + Create
        </button>
      </form>
    </div>
  );
}
