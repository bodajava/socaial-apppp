import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostContext from "../context/PostContext";
import useForm from "from-modules/useForm";

export default function Home() {
  const { posts, setPosts } = useContext(PostContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showComments, setShowComments] = useState({});

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      content: "",
      postId: "",
    },
  });

  async function addComment(value) {
    try {
      console.log("Saving comment...", value);
      await axios.post("/comments", {
        post: posts.postId,
        content: value.content,
      });
      const res = await axios.get(`/posts/${posts.postId}/comments`);
      setPosts((prevPosts) => [
        ...prevPosts,
        { id: value.postId, comments: res.data.comments },
      ]);
    } catch (err) {
      console.error("Failed to send comment:", err);
    }
  }

  async function getPosts() {
    try {
      setLoading(true);
      const res = await axios.get("/posts");
      if (res.data.length) {
        setPosts(res.data);
      } else {
        setPosts([]);
      }
    } catch (err) {
      setError("Error fetching posts");
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPosts();
  }, []);

  function toggleComments(postId) {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-full bg-white shadow-md sticky top-0">
        {/* Add your header here */}
      </div>

      <div className="flex-1 p-4 rounded-lg bg-white space-y-4">
        {loading && <div className="flex justify-center items-center my-20">Loading...</div>}
        {error && <div className="text-gray-400">No posts found</div>}

        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="p-4 shadow rounded-lg bg-white">
              <h2>{post.user.name}</h2>
              <p>{post.content}</p>
              <button onClick={() => toggleComments(post.id)}>Toggle Comments</button>
              {showComments[post.id] && (
                <div id={`comments-${post.id}`} className="mt-3 pl-3 border-l border-gray-200">
                  {/* الكومنتات هنا */}
                  {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                      <div key={comment.id} className="mt-2">
                        <p>{comment.creator.name}: {comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No comments yet</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-gray-400">No posts found</div>
        )}

        <form onSubmit={handleSubmit((data) => addComment(data))}>
          <input
            type="text"
            required
            {...register("content", { required: true })}
            placeholder="Type your comment here"
          />
          <button type="submit" className="btn-submit">Send</button>
        </form>
      </div>
    </div>
  );
}
