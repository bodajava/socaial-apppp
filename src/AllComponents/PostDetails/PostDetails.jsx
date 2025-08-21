import React, { useState } from "react";
import style from "./PostDetails.module.css";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Navbar from "../Navbar/Navbar";

export default function PostDetails() {
  let { id } = useParams();
  const [showComments, setShowComments] = useState(false);

  function getSinglePost() {
    return axios.get(`https://linked-posts.routemisr.com/posts/${id}`, {
      headers: {
        token: localStorage.getItem("userToken"),
      },
    });
  }

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["GetSinglePost", id],
    queryFn: getSinglePost,
    select: (data) => data?.data?.post,
  });

  const post = data;

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className=" h-screen sticky top-0">
        <Navbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex justify-center items-start p-8 bg-gray-100 min-h-screen">
        {/* Loader */}
        {isLoading && (
          <div className="flex justify-center items-center py-90 w-full">
            <span className={style.loader}></span>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="text-red-500 font-semibold text-center mt-10">
            {error.message || "Something went wrong while fetching post"}
          </div>
        )}

        {/* Post Content */}
        {!isLoading && !isError && post && (
          <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-2xl hover:shadow-xl transition-shadow duration-300">
            {/* User Info */}
            <div className="flex items-center gap-4 mb-6">
              {post?.user?.photo ? (
                <img
                  src={post.user.photo}
                  alt={post.user.name}
                  className="w-14 h-14 rounded-full object-cover border border-gray-300"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xl">
                  {post?.user?.name?.[0] || "?"}
                </div>
              )}
              <div>
                <p className="font-semibold text-lg">{post?.user?.name}</p>
                <p className="text-gray-500 text-sm">
                  @{post?.user?.name?.split(" ")[0].toLowerCase() || "user"}
                </p>
              </div>
            </div>

            {/* Post Content */}
            <p className="mb-4 text-gray-800 leading-relaxed">
              {post?.content || "No content"}
            </p>

            {post?.image && (
              <img
                src={post.image}
                alt="post"
                className="w-full rounded-lg object-cover mb-4"
              />
            )}

            {/* Likes & Comments Toggle */}
            <div className="flex justify-between text-gray-600 text-sm border-t pt-3 mb-3">
              <span>👍 {post?.likes ?? 0} Likes</span>
              <button
                onClick={() => setShowComments(!showComments)}
                className="text-blue-600 font-medium hover:underline"
              >
                💬 {post?.comments?.length ?? 0} Comments
              </button>
            </div>

            {/* Comments Section */}
            {showComments && post?.comments?.length > 0 && (
              <div className="max-h-80 overflow-y-auto border-t pt-3">
                {post.comments.map((comment, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 mb-4 bg-gray-50 p-3 rounded-lg"
                  >
                    {comment?.commentCreator?.photo ? (
                      <img
                        src={comment.commentCreator.photo}
                        alt={comment.commentCreator.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                        {comment?.commentCreator?.name?.[0] || "?"}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold">
                        {comment?.commentCreator?.name || "User"}
                      </p>
                      <p className="text-sm text-gray-700">{comment?.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {showComments && post?.comments?.length === 0 && (
              <p className="text-gray-400 text-center mt-3">
                No comments yet
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
