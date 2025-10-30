import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import routes from "./routes/routes";
import Header from "./utils/header";
import api from "./api/api";
import { setUser } from "./redux/authReducer";

function AppWrapper() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      // ✅ Allow these routes to be public
      const publicRoutes = ["/login", "/set-password"];
      if (publicRoutes.includes(location.pathname)) return;

      try {
        const token = sessionStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await api.get("/api/auth/me");
        dispatch(setUser(res?.user || {}));
      } catch (err) {
        console.error("Failed to fetch user:", err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [location.pathname, dispatch, navigate]);

  return (
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          path={route.path}
          element={
            <>
              {route.header && <Header />}
              {route.element}
            </>
          }
        />
      ))}

      {/* Redirect unknown routes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}

export default App;
