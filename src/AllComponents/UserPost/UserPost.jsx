import React, { useState } from "react";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import UpdatePost from "../UpdatePost/UpdatePost.jsx";
import { Toaster, toast } from "sonner";

export default function UserPost({ id }) {

  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState({});
  const [showUpdateForm, setShowUpdateForm] = useState(null);

  const getUserPost = () => axios.get(`https://linked-posts.routemisr.com/users/${id}/posts`, {
    headers: { token: localStorage.getItem("userToken") },
  });

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["userPost", id],
    queryFn: getUserPost,
    enabled: !!id,
  });

  if (isLoading) return <p className="text-center mt-4">Loading...</p>;
  if (isError) return <p className="text-center mt-4 text-red-500">{error.message}</p>;

  const posts = data?.data?.posts || [];

  const toggleComments = (postId) => setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  const toggleUpdateForm = (postId) => setShowUpdateForm(prev => prev === postId ? null : postId);

  function deletPost(postId){
    axios.delete(`https://linked-posts.routemisr.com/posts/${postId}`, {
      headers: {
        token: localStorage.getItem("userToken")
      }
    })
    .then((res) => {
      console.log(res);
      if(res.data.masseg === "succses"){
        queryClient.invalidateQueries(["userPost", id]); // تحديث قائمة البوستات
        toast.success("Post deleted successfully!");
      }
    })
    .catch((err) => {
      console.log(err);
      toast.error("Failed to delete post!");
    });
  }

  return (
    <div className="mt-6 max-w-lg w-full p-4 bg-gray-100 rounded-lg shadow mx-auto">
      <Toaster position="top-right" />

      {posts.length === 0 ? (
        <p className="text-gray-700 text-center">You don't have any posts</p>
      ) : (
        posts.map(post => (
          <div key={post._id} className="bg-white p-4 mb-4 rounded-lg shadow-sm border">
            {/* بيانات البوست */}
            <div className="flex gap-3 items-center mb-2">
              {post.user?.photo ? (
                <img src={post.user.photo} alt={post.user.name} className="w-10 h-10 rounded-full object-cover"/>
              ) : (
                <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold">
                  {post.user?.name?.[0] || "?"}
                </div>
              )}
              <div>
                <p className="font-semibold">{post.user?.name || "Unknown"}</p>
                <p className="text-xs text-gray-400">
                  {post.createdAt ? new Date(post.createdAt).toLocaleString() : "No date"}
                </p>
              </div>
            </div>

            <p className="mb-2">{post.body || "No content"}</p>

            {post.image && (
              <img src={post.image} alt="post" className="w-full h-60 object-cover rounded-lg mb-2"/>
            )}

            <div className="flex justify-between text-gray-500 text-sm mt-2">
              <span>{post.likes ?? 0} Likes</span>
              <button
                onClick={() => toggleComments(post._id)}
                className="text-blue-600 hover:underline"
              >
                Comments ({post.comments?.length ?? 0})
              </button>
            </div>

            {/* أزرار التحكم */}
            <div className="flex gap-2 mt-4">
              <button
                className="px-4 py-2 bg-amber-300 text-white rounded-lg hover:bg-amber-400"
                onClick={() => toggleUpdateForm(post._id)}
              >
                Update Post
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                onClick={() => deletPost(post._id)}
              >
                Delete Post
              </button>
            </div>

            {/* فورم التحديث */}
            {showUpdateForm === post._id && <UpdatePost userId={id} post={post} />}

            {/* التعليقات */}
            {showComments[post._id] && (
              <div className="mt-3 pl-3 border-l border-gray-200">
                {post.comments?.length > 0 ? (
                  post.comments.map((comment, i) => (
                    <div key={i} className="flex items-start gap-2 mb-3">
                      {comment.commentCreator?.photo ? (
                        <img src={comment.commentCreator.photo} alt={comment.commentCreator.name} className="w-8 h-8 rounded-full object-cover"/>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                          {comment.commentCreator?.name?.[0] || "?"}
                        </div>
                      )}
                      <div className="bg-gray-100 p-2 rounded-lg">
                        <p className="text-sm font-semibold">{comment.commentCreator?.name || "User"}</p>
                        <p className="text-sm text-gray-600">{comment.text}</p>
                      </div>
                    </div>
                  ))
                ) : <p className="text-gray-400 text-sm">No comments yet</p>}
              </div>
            )}
          </div>
        ))
      )}
   
    </div>
  );
}
