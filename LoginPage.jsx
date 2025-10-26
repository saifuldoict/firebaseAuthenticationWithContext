import React, { useState, useContext } from "react";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { AuthContext } from "../context/AuthProvider";
import { Link, useNavigate, useLocation } from "react-router";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [show, setShow] = useState(false);
  const [error, setError] = useState(""); 
  const { loginUser, loginWithGoogle, resetPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to home page after login
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    setError("");

    try {
      await loginUser(email, password);
      toast.success("Login Successful!");
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message); 
      toast.error(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    setError("");
    try {
      await loginWithGoogle();
      toast.success("Logged in with Google!");
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

  const handleForgetPassword = async () => {
    const emailInput = document.querySelector('input[name="email"]')?.value;
    const email = prompt("Enter your email for password reset:", emailInput || "");
    if (!email) return;

    try {
      await resetPassword(email);
      toast.success("Password reset email sent!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex justify-center min-h-screen items-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8">
        <h2 className="text-2xl font-semibold mb-5 text-center text-white">
          Login to Your Account
        </h2>

        <form onSubmit={handleLogin} className="space-y-5 text-white">
          {error && <p className="text-red-400 text-sm">{error}</p>} 

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="example@email.com"
              className="input input-bordered w-full bg-white/20 text-white placeholder-white/60"
              required
            />
          </div>

          <div className="relative">
            <label className="block text-sm mb-1">Password</label>
            <input
              type={show ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              className="input input-bordered w-full bg-white/20 text-white placeholder-white/60"
              required
            />
            <span
              className="absolute right-[8px] top-[36px] cursor-pointer"
              onClick={() => setShow(!show)}
            >
              {show ? <IoEyeOff size={20} /> : <FaEye size={20} />}
            </span>
          </div>

          <div className="text-right">
            <button
              type="button"
              onClick={handleForgetPassword}
              className="text-sm text-pink-300 hover:text-white underline"
            >
              Forget Password?
            </button>
          </div>

          <button type="submit" className="my-btn w-full bg-pink-500 hover:bg-pink-600">
            Login
          </button>

          <div className="flex items-center justify-center gap-2 my-2">
            <div className="h-px w-16 bg-white/30"></div>
            <span className="text-sm text-white/70">or</span>
            <div className="h-px w-16 bg-white/30"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-3 bg-white text-gray-800 px-5 py-2 rounded-lg w-full font-semibold hover:bg-gray-100"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            Continue with Google
          </button>

          <p className="text-center text-sm text-white/80 mt-3">
            Don’t have an account?{" "}
            <Link to="/register" className="text-pink-300 underline hover:text-white">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

