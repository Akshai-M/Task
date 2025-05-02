import { Navigate, Route, Routes } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Signup from "./pages/Signup";
import LoginPage from "./pages/LoginPage";
import Settings from "./pages/Settings";
import ProfilePage from "./pages/ProfilePage";
import Navbar from "./components/Navbar";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader } from "lucide-react";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  console.log({ authUser });
  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  const paths = [
    {
      path: "/",
      element: <Homepage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/settings",
      element: <Settings />,
    },
    {
      path: "/profilepage",
      element: <ProfilePage />,
    },
  ];
  return (
    <div>
      <Navbar />
      <Routes>
        {paths.map((route) => (
          <Route key={route.path} path={route.path} element={authUser ? route.element : <Navigate to="/login" />} />
        ))}

        <Route path="/signup" element={<Signup/>}></Route>

      </Routes>
    </div>
  );
};

export default App;
