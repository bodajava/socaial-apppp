import React from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Toaster, toast } from "sonner";
import style from "./UpdatePost.module.css";

export default function UpdatePost({ userId, post }) {
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      body: post?.body || "",
      image: "",
    },
  });

  const { register, handleSubmit, reset } = form;

  // دالة التحديث
  const mutation = useMutation({
    mutationFn: (myData) =>
      axios.put(`https://linked-posts.routemisr.com/posts/${post._id}`, myData, {
        headers: { token: localStorage.getItem("userToken") },
      }),
    onSuccess: () => {
      toast.success("Post updated successfully!");
      reset();
      queryClient.invalidateQueries(["userPost", userId]);
    },
    onError: () => {
      toast.error("Failed to update post!");
    },
  });

  function handleUpdatePost(values) {
    const myData = new FormData();
    myData.append("body", values.body);
    if (values.image?.[0]) myData.append("image", values.image[0]);

    mutation.mutate(myData);
  }

  return (
    <div className="w-full max-w-lg mx-auto bg-white shadow-lg rounded-2xl p-6 mb-6">
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit(handleUpdatePost)}>
        <input
          {...register("body")}
          type="text"
          placeholder="Update your post..."
          className="w-full p-3 border rounded-xl mb-4"
        />

        <label className="block w-full border-2 border-dashed rounded-xl p-4 text-center text-gray-500 cursor-pointer mb-4">
          <input {...register("image")} type="file" className="hidden" />
          Click to upload a new image
        </label>

        <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-xl">
          Update
        </button>
      </form>
    </div>
  );
}
