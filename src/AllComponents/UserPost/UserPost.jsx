import React from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'

export default function UserPost({id}) {

  function gituserpost () {
    return axios.get(`https://linked-posts.routemisr.com/users/${id}/posts?limit=2`, {
      headers:{
        token:localStorage.getItem("userToken")
      }
    })
  }

  let { data, isError, isLoading, error } = useQuery({
    queryKey:["userpost", id],
    queryFn: gituserpost,
    select: (data) => data?.data?.posts   
  })

  if (isLoading) return <p className="text-center mt-10">Loading posts...</p>
  if (isError) return <p className="text-center mt-10 text-red-500">Error: {error.message}</p>

  return (
    <div className="max-w-xl mx-auto mt-6 space-y-4">
      {data && data.length > 0 ? (
        data.map((post) => (
          <div key={post._id} className="p-4 bg-white rounded-lg shadow">
            <h3 className="font-bold text-lg mb-2">{post.title}</h3>
            <p className="text-gray-700">{post.body}</p>
          </div>
        ))
      ) : (
        <p className="text-center text-red-500">No posts found</p>
      )}
    </div>
  )
}
