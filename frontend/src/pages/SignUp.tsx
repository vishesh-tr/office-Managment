import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import SEO from "../components/SEO";

const SignupForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:4008/user/signup", { email, username, password });
      console.log(res.data);
      toast.success("Signup successful! Please log in.");
      navigate("/");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f3f1fc] p-6">
      <SEO title="Signup Page" description="This is my Signup page" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl p-6 md:p-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl w-full overflow-hidden gap-6">
          <motion.aside
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="bg-gradient-to-br from-[#a178ed] to-[#a178ed] text-white px-6 py-8 md:px-10 md:py-12 flex flex-col justify-center gap-6 md:gap-8"
          >
            <article className="flex items-start gap-4">
              <div>
                <h3 className="text-base text-white font-semibold">Quick and free sign-up</h3>
                <p className="text-sm text-white">Enter your email address to create an account.</p>
              </div>
            </article>
          </motion.aside>

          <motion.section
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-white px-6 py-8 md:px-10 md:py-12"
          >
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Create your account</h2>
            <form onSubmit={handleSignup} className="space-y-6">
              <div>
                <label htmlFor="email" className="text-xs font-bold text-gray-600 block mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-50 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#a77ff2]"
                />
              </div>
              <div>
                <label htmlFor="username" className="text-xs font-bold text-gray-600 block mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a77ff2]"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-xs font-bold text-gray-600 block mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Type to create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a77ff2]"
                />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="updates" className="accent-[#a77ff2]" />
                <label htmlFor="updates" className="text-sm text-gray-600">
                  Get updates and notifications about our product.
                </label>
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#a178ed] hover:bg-[#8e6ce0] transition text-white rounded-md shadow-sm font-medium"
              >
                Sign Up
              </button>
            </form>

            <div className="mt-6 text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link to="/" className="text-[#a77ff2] hover:underline font-medium">
                Back to Login
              </Link>
            </div>
          </motion.section>
        </div>
      </motion.div>
    </main>
  );
};

export default SignupForm;
