import React, { useContext, useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import { PostContext } from "../../context/PostContext";
import style from "./Home.module.css";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Toaster, toast } from "sonner";

export default function Home() {
  const { getAllPost } = useContext(PostContext);
  const [postes, setPostes] = useState([]);
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [loading, setLoading] = useState(false);

  const currentUserId = localStorage.getItem("userId");
  const token = localStorage.getItem("userToken");

  const { register, handleSubmit, reset } = useForm({
    defaultValues: { content: "" },
  });

  // إرسال تعليق جديد
  async function gitComment(data) {
    try {
      const { content, postId } = data;
      const res = await axios.post(
        `https://linked-posts.routemisr.com/comments`,
        { content, post: postId },
        { headers: { token } }
      );

      setPostes((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, comments: [...(post.comments || []), res.data.comment] }
            : post
        )
      );

      reset();
      toast.success("Comment added!");
    } catch (err) {
      console.error(err);
      setError("Failed to send comment");
      toast.error("Failed to add comment");
    }
  }

  // تعديل تعليق
  async function updateComment(commentId, content, postId) {
    try {
      const res = await axios.put(
        `https://linked-posts.routemisr.com/comments/${commentId}`,
        { content },
        { headers: { token } }
      );

      setPostes((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: post.comments.map((c) =>
                  c._id === commentId ? { ...c, content: res.data.comment.content } : c
                ),
              }
            : post
        )
      );

      setEditingCommentId(null);
      toast.success("Comment updated!");
    } catch (err) {
      console.error(err);
      setError("Failed to update comment");
      toast.error("Failed to update comment");
    }
  }

  // حذف تعليق
  async function deleteComment(commentId, postId) {
    try {
      await axios.delete(
        `https://linked-posts.routemisr.com/comments/${commentId}`,
        { headers: { token } }
      );

      setPostes((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, comments: post.comments.filter((c) => c._id !== commentId) }
            : post
        )
      );

      toast.success("Comment deleted!");
    } catch (err) {
      console.error(err);
      setError("Failed to delete comment");
      toast.error("Failed to delete comment");
    }
  }

  // جلب جميع البوستات
  async function getPosts() {
    try {
      setLoading(true);
      const res = await getAllPost();
      setPostes(res || []);
    } catch (err) {
      console.error(err);
      setError("Error fetching posts");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  function toggleComments(postId) {
    setShowComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <div className="h-screen sticky top-0">
        <Navbar />
      </div>

      <div className="flex-1 p-4 md:p-6 overflow-y-auto">
        {error && <div className="text-red-500 font-semibold mb-4">{error}</div>}

        {loading && (
          <div className="flex justify-center items-center py-20">
            <span className={style.loader}></span>
          </div>
        )}

        {!loading &&
          postes.map((post) => (
            <div key={post._id} className="bg-white p-4 rounded-lg shadow mb-4">
              {/* بيانات البوست */}
              <div className="flex gap-3 items-center mb-2">
                {post.user?.photo ? (
                  <img
                    src={post.user.photo}
                    alt={post.user.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
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

              <Link to={`/PostDetails/${post._id}`}>
                <p className="mb-2 cursor-pointer hover:underline">{post.content}</p>
                {post.image && (
                  <img
                    src={post.image}
                    alt="post"
                    className="w-full h-48 object-cover rounded-lg mb-2"
                  />
                )}
              </Link>

              <div className="flex justify-between text-gray-500 text-sm mt-2">
                <span>{post.likes ?? 0} Likes</span>
                <button
                  onClick={() => toggleComments(post._id)}
                  className="text-blue-600 hover:underline"
                >
                  Comments ({post.comments?.length ?? 0})
                </button>
              </div>

              {/* إضافة تعليق */}
              <form
                onSubmit={handleSubmit((data, e) => {
                  e.preventDefault();
                  gitComment({ ...data, postId: post._id });
                })}
                className="flex gap-2 mt-3"
              >
                <input
                  {...register("content", { required: true })}
                  type="text"
                  placeholder="Write a comment..."
                  className="flex-1 border border-gray-300 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm hover:bg-blue-700"
                >
                  Send
                </button>
              </form>

              {/* التعليقات */}
              {showComments[post._id] && (
                <div className="mt-3 pl-3 border-l border-gray-200">
                  {post.comments?.length > 0 ? (
                    post.comments.map((comment) => (
                      <div key={comment._id} className="flex items-center gap-2 mb-3">
                        {comment.commentCreator?.photo ? (
                          <img
                            src={comment.commentCreator.photo}
                            alt={comment.commentCreator.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                            {comment.commentCreator?.name?.[0] || "?"}
                          </div>
                        )}

                        <div className="flex-1 flex justify-between items-center bg-gray-100 p-2 rounded-lg">
                          {editingCommentId === comment._id ? (
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                updateComment(comment._id, e.target.content.value, post._id);
                              }}
                              className="flex gap-1 w-full"
                            >
                              <input
                                name="content"
                                defaultValue={comment.content}
                                className="flex-1 border p-1 rounded text-sm"
                              />
                              <button type="submit" className="text-green-600 text-xs">
                                Save
                              </button>
                              <button
                                type="button"
                                className="text-gray-500 text-xs"
                                onClick={() => setEditingCommentId(null)}
                              >
                                Cancel
                              </button>
                            </form>
                          ) : (
                            <>
                              <p className="text-sm flex-1">{comment.content}</p>
                              {comment.commentCreator?._id === currentUserId && (
                                <div className="flex gap-1 text-xs">
                                  <button
                                    className="text-yellow-500"
                                    onClick={() => setEditingCommentId(comment._id)}
                                  >
                                    Edit
                                  </button>
                                  <button
                                    className="text-red-500"
                                    onClick={() => deleteComment(comment._id, post._id)}
                                  >
                                    Delete
                                  </button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400 text-sm">No comments yet</p>
                  )}
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
