import axios from "axios";
import { createContext } from "react";

export const PostContext = createContext();

export default function PostContextProvider({ children }) {
  function getAllPost() {
    return axios
      .get("https://linked-posts.routemisr.com/posts?limit=50", {
        headers: {
          token: localStorage.getItem("userToken"),
        },
      })
      .then((res) => res.data.posts)
      .catch((err) => {
        console.error("Error in getAllPost:", err);
        return [];
      });
  }

  return (
    <PostContext.Provider value={{ getAllPost }}>
      {children}
    </PostContext.Provider>
  );
}
