import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../api/api";
import { useToast } from "../../utils/toastprovider";
import logo from "../../assets/logo.png";

const SetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [particles, setParticles] = useState([]);
  const [mouseParticles, setMouseParticles] = useState([]);
  const [strength, setStrength] = useState(0);
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // extract token
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tokenParam = params.get("token");
    if (tokenParam) setToken(tokenParam);
    else showToast("Invalid or missing token ❌", "error");
  }, [location, showToast]);

  // floating particles
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

  // Password requirements validation
  const checkPasswordStrength = (pwd) => {
    const req = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pwd),
    };

    setRequirements(req);

    const met = Object.values(req).filter(Boolean).length;
    setStrength(met);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      showToast("Passwords do not match ❌", "warning");
      return;
    }

    if (strength < 5) {
      showToast("Password does not meet all requirements ⚠️", "error");
      return;
    }

    try {
      const res = await api.post("/api/auth/set-password", { token, password });

      if (res.status === 200) {
        showToast("✅ Password set successfully! Redirecting...", "success");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        showToast(res.data?.message || "Something went wrong ❌", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error setting password ❌", "error");
    }
  };

  const getStrengthColor = () => {
    switch (strength) {
      case 5:
        return "bg-green-500";
      case 4:
        return "bg-lime-500";
      case 3:
        return "bg-yellow-400";
      case 2:
        return "bg-orange-400";
      default:
        return "bg-red-500";
    }
  };

  return (
    <div className="flex min-h-screen" onMouseMove={handleMouseMove}>
      {/* Left Section (Branding) */}
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
        </div>
      </div>

      {/* Right Section (Form) */}
      <div className="flex-1 flex items-center justify-center bg-white animate-slide-in-right">
        <div className="w-full max-w-md p-10 bg-gray-50 rounded-2xl shadow-3xl border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">
            Set Your Password
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                checkPasswordStrength(e.target.value);
              }}
              className="w-full p-4 mb-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
              required
            />

            {/* Password Strength Meter */}
            {password && (
              <div className="w-full h-2 rounded-full mb-4 overflow-hidden bg-gray-200">
                <div
                  className={`h-2 ${getStrengthColor()} transition-all duration-300`}
                  style={{ width: `${(strength / 5) * 100}%` }}
                ></div>
              </div>
            )}

            <div className="text-sm text-gray-700 mb-4">
              <p className="font-medium mb-1">Password must include:</p>
              <ul className="space-y-1">
                {[
                  { key: "length", label: "At least 8 characters" },
                  { key: "uppercase", label: "One uppercase letter (A–Z)" },
                  { key: "lowercase", label: "One lowercase letter (a–z)" },
                  { key: "number", label: "One number (0–9)" },
                  { key: "special", label: "One special character (!@#$...)" },
                ].map((req) => (
                  <li
                    key={req.key}
                    className={`flex items-center gap-2 transition-all ${
                      requirements[req.key]
                        ? "text-green-600"
                        : "text-gray-400"
                    }`}
                  >
                    {requirements[req.key] ? "✅" : "⚪"} {req.label}
                  </li>
                ))}
              </ul>
            </div>

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-4 mb-6 border border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
              required
            />

            <button
              type="submit"
              disabled={strength < 5}
              className={`w-full py-4 rounded-xl text-black font-semibold transform transition-all duration-300 shadow-xl ${
                strength < 5
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-yellow-500 hover:bg-yellow-600 hover:scale-105"
              }`}
            >
              Set Password
            </button>
          </form>

          <p className="mt-6 text-center text-gray-500 text-sm">
            &copy; 2025 NRDC — Minerals & Stones Testing
          </p>
        </div>
      </div>
    </div>
  );
};

export default SetPassword;
