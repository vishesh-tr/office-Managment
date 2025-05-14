import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4008/user/login", { email, password });
      console.log(res.data);
      localStorage.setItem("token", res.data.token);
      toast.success("Login successful!");
      navigate("/dashboard"); 
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f3f1fc] p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl w-full overflow-hidden gap-6">
          <aside className="bg-gradient-to-br from-[#a178ed] to-[#a178ed] text-white px-6 py-8 md:px-10 md:py-12 flex flex-col justify-center gap-6 md:gap-8">
            {[{ title: "Welcome back", desc: "Log in to access your dashboard and projects." }].map((item, idx) => (
              <article key={idx} className="flex items-start gap-4">
                <span className="text-xl"></span>
                <div>
                  <h3 className="text-base text-white">{item.title}</h3>
                  <p className="text-sm text-white">{item.desc}</p>
                </div>
              </article>
            ))}
          </aside>

          <section className="bg-white px-6 py-8 md:px-10 md:py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-8">Welcome back!</h2>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label htmlFor="email" className="text-xs font-bold text-gray-600 block mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-50 rounded-sm focus:outline-none focus:ring-2 focus:ring-[#a77ff2]"
                />
              </div>
              <div>
                <label htmlFor="password" className="text-xs font-bold text-gray-600 block mb-1">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a77ff2]"
                />
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="accent-[#a77ff2]" />
                  <label htmlFor="remember" className="text-gray-600">Remember me</label>
                </div>
                <a href="/forgot-password" className="text-[#a77ff2] hover:underline">Forgot password?</a>
              </div>
              <button type="submit" className="w-full py-2 bg-[#a178ed] hover:bg-[#a178ed] transition text-white rounded-md shadow-sm font-medium">
                Log In
              </button>
            </form>

            <div className="mt-6 text-sm text-center text-gray-600">
              Don't have an account?{" "}
              <button onClick={() => navigate("/SignUp")} className="text-[#a77ff2] hover:underline font-medium">
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
