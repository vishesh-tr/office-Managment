import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../api/authApi";
import SEO from "../components/SEO";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { accessToken, refreshToken, expiresIn } = await login({
        email,
        password,
      }).unwrap();

      const expiryTime = Date.now() + expiresIn * 1000;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("expiry", expiryTime.toString());

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f3f1fc] p-6">
      <SEO title="Login Page" description="This is my Login page" />
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side */}
          <aside className="bg-gradient-to-br from-[#a178ed] to-[#a178ed] text-white px-6 py-8 md:px-10 md:py-12 flex flex-col justify-center gap-6 md:gap-8">
            <article className="flex items-start gap-4">
              <div>
                <h3 className="text-base font-semibold">Welcome back</h3>
                <p className="text-sm">Log in to access your dashboard and projects.</p>
              </div>
            </article>
          </aside>

          {/* Right Side (Form) */}
          <section className="bg-white px-6 py-8 md:px-10 md:py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Welcome back!</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="text-xs font-bold text-gray-600 block mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a77ff2]"
                />
              </div>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="accent-[#a77ff2]" />
                  <label htmlFor="remember" className="text-gray-600">
                    Remember me
                  </label>
                </div>
                <a href="/forgot-password" className="text-[#a77ff2] hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-[#a178ed] hover:bg-[#915be0] transition text-white rounded-md shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Log In"}
              </button>
            </form>

            <div className="mt-6 text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/SignUp")}
                className="text-[#a77ff2] hover:underline font-medium"
              >
                Sign up
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default LoginForm;
