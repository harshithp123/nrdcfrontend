// src/pages/Login.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/api";
import logo from "../../assets/logo.png";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux/authReducer";
import { useToast } from "../../utils/toastprovider";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [particles, setParticles] = useState([]);
  const [mouseParticles, setMouseParticles] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showToast } = useToast(); // ✅ get toast function

  // Floating particles
  useEffect(() => {
    const particleCount = 30;
    const newParticles = Array.from({ length: particleCount }, () => ({
      id: Math.random(),
      size: Math.random() * 6 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 5,
      speed: Math.random() * 10 + 5,
      color: ["#FFD700", "#FFA500", "#FFF8DC"][Math.floor(Math.random() * 3)],
    }));
    setParticles(newParticles);
  }, []);

  // Mouse-follow particles
  const handleMouseMove = (e) => {
    const newParticle = {
      id: Math.random(),
      size: Math.random() * 8 + 2,
      x: (e.clientX / window.innerWidth) * 100,
      y: (e.clientY / window.innerHeight) * 100,
      color: ["#FFD700", "#FFA500", "#FFF8DC"][Math.floor(Math.random() * 3)],
      life: 100,
    };
    setMouseParticles((prev) => [...prev, newParticle]);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setMouseParticles((prev) =>
        prev
          .map((p) => ({ ...p, y: p.y - 0.2, life: p.life - 1 }))
          .filter((p) => p.life > 0)
      );
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // ✅ Login handler with Toasts
  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Please enter email and password", "warning");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/api/auth/login", { email, password });

      if (response.status === 200) {
        dispatch(setUser(response?.user));
        sessionStorage.setItem("token", response?.accessToken);

        showToast("Login successful!", "success");
        navigate("/dashboard");
      } else {
        showToast(response?.data?.message || "Login failed", "error");
      }
    } catch (err) {
      console.error("Login error:", err.response || err);
      showToast(
        err.response?.data?.message || "Something went wrong",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen" onMouseMove={handleMouseMove}>
      {/* Left Hero Section */}
      <div className="flex-1 relative bg-black overflow-hidden flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black animate-gradient opacity-90"></div>

        {/* Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full opacity-70 animate-float"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              left: `${p.x}%`,
              top: `${p.y}%`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.speed}s`,
            }}
          />
        ))}
        {mouseParticles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full opacity-80"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              backgroundColor: p.color,
              left: `${p.x}%`,
              top: `${p.y}%`,
              transition: "all 0.1s linear",
            }}
          />
        ))}

        {/* Hero Text + Logo */}
        <div className="relative z-10 px-10 text-center animate-slide-in-left">
          <img
            src={logo}
            alt="NRDC Logo"
            className="h-24 w-auto mx-auto mb-6 animate-float"
          />
          <h1 className="text-6xl font-extrabold mb-4 tracking-wide text-white">
            NRDC Portal
          </h1>
          <p className="text-xl text-gray-300 mb-10">
            Minerals & Stones Testing <br /> Accurate, Reliable, Trusted
          </p>
          <div className="mt-10">
            <svg
              className="w-64 h-64 mx-auto animate-spin-slow text-yellow-500 opacity-30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex items-center justify-center bg-white animate-slide-in-right">
        <div className="w-full max-w-md p-12 bg-gray-50 rounded-2xl shadow-3xl border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Login
          </h2>

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 mb-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 hover:scale-105"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 mb-6 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300 hover:scale-105"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-yellow-500 text-black py-4 rounded-xl hover:bg-yellow-600 transform hover:scale-105 transition-all duration-300 shadow-xl disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <p className="mt-6 text-center text-gray-500 text-sm">
            &copy; 2025 NRDC — Minerals & Stones Testing
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
