import React, { useState, useContext } from "react";
import { FaEye } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate, Link } from "react-router";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const { registerUser, loginWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate();
//রেজিস্টার কোড শুরু
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const photoURL = e.target.photo.value.trim();
    const password = e.target.password.value.trim();

// পাসওয়ার্ড চেক
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (!/[A-Z]/.test(password)) return setError("Password must have an uppercase letter.");
    if (!/[a-z]/.test(password)) return setError("Password must have a lowercase letter.");

    try {
      await registerUser(name, email, password, photoURL);
      toast.success("Registration Successful!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };
//  রেজিস্টার  শেষ

  //গুগলের মাধ্যমে রেজিস্টেশন
  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      toast.success("Logged in with Google!");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex justify-center min-h-screen items-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500">
      <div className="w-full max-w-md backdrop-blur-lg bg-white/10 border border-white/20 shadow-2xl rounded-2xl p-8">
        <h2 className="text-2xl font-semibold mb-5 text-center text-white">
          Create Your Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-5 text-white">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input type="text" name="name" placeholder="Enter your name" className="input input-bordered w-full bg-white/20 text-white placeholder-white/60" required />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input type="email" name="email" placeholder="example@email.com" className="input input-bordered w-full bg-white/20 text-white placeholder-white/60" required />
          </div>

          <div>
            <label className="block text-sm mb-1">Photo URL</label>
            <input type="text" name="photo" placeholder="https://example.com/photo.jpg" className="input input-bordered w-full bg-white/20 text-white placeholder-white/60" />
          </div>

          <div className="relative">
            <label className="block text-sm mb-1">Password</label>
            <input type={show ? "text" : "password"} name="password" placeholder="••••••••" className="input input-bordered w-full bg-white/20 text-white placeholder-white/60" required />
            <span className="absolute right-[8px] top-[36px] cursor-pointer" onClick={() => setShow(!show)}>
              {show ? <IoEyeOff size={20} /> : <FaEye size={20} />}
            </span>
          </div>

          {error && <p className="text-red-300 text-sm">{error}</p>}

          <button type="submit" className="my-btn w-full bg-pink-500 hover:bg-pink-600">Register</button>

          <div className="flex items-center justify-center gap-2 my-2">
            <div className="h-px w-16 bg-white/30"></div>
            <span className="text-sm text-white/70">or</span>
            <div className="h-px w-16 bg-white/30"></div>
          </div>

          <button type="button" onClick={handleGoogleLogin} className="flex items-center justify-center gap-3 bg-white text-gray-800 px-5 py-2 rounded-lg w-full font-semibold hover:bg-gray-100">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google" className="w-5 h-5" />
            Continue with Google
          </button>

          <p className="text-center text-sm text-white/80 mt-3">
            Already have an account? <Link to="/login" className="text-pink-300 underline hover:text-white">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
