import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Me from "./AllComponents/Me/Me";
import Regester from "./AllComponents/Regester/Regester";
import Home from "./AllComponents/Home/Home";
import SignIn from "./AllComponents/SignIn/SignIn";
import Layout from "./AllComponents/Layout/Layout"; 
import NotFound from "./AllComponents/NotFound/NotFound";
import ProtectedRoute from "./AllComponents/ProtectedRoute/ProtectedRoute";
import "@fortawesome/fontawesome-free/css/all.min.css";
import PostContextProvider from './context/PostContext';  
import PostDetails from "./AllComponents/PostDetails/PostDetails";
import Setting from './AllComponents/Setting/Setting';


// React Query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import CreatPost from "./AllComponents/CreatPost/CreatPost";

function App() {
  // نعمل client جديد للـ react-query
  const queryClient = new QueryClient();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <SignIn /> },
        { path: "Signin", element: <SignIn /> },
        { path: "Home", element: <ProtectedRoute><Home /></ProtectedRoute> },
        { path: "Me", element: <ProtectedRoute><Me /></ProtectedRoute> },
        { path: "Setting", element: <ProtectedRoute><Setting /></ProtectedRoute> }, // مسار فريد
                { path: "CreatPost", element: <ProtectedRoute><CreatPost /></ProtectedRoute> }, // مسار فريد

        { path: "PostDetails/:id", element: <ProtectedRoute><PostDetails /></ProtectedRoute> },
        { path: "Regester", element: <Regester /> },
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return (
    <QueryClientProvider client={queryClient}>
      <PostContextProvider>
        <RouterProvider router={router} />
      </PostContextProvider>
    </QueryClientProvider>
  ); 
}

export default App;
