import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../api/authApi";
import SEO from "../components/SEO";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [login, { isLoading }] = useLoginMutation();

  // Canvas animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to window size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Circle interface
    interface Circle {
      x: number;
      y: number;
      r: number;
      dx: number;
      dy: number;
      color: string;
    }

    // Generate circles
    const circles: Circle[] = Array.from({ length: 30 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: 18 + Math.random() * 12,
      dx: -0.4 + Math.random() * 0.8,
      dy: -0.4 + Math.random() * 0.8,
      color: `rgba(161, 120, 237, ${0.08 + Math.random() * 0.12})`,
    }));

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      circles.forEach((c) => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fillStyle = c.color;
        ctx.fill();
        c.x += c.dx;
        c.y += c.dy;

        // Wrap around edges
        if (c.x < -c.r) c.x = canvas.width + c.r;
        if (c.x > canvas.width + c.r) c.x = -c.r;
        if (c.y < -c.r) c.y = canvas.height + c.r;
        if (c.y > canvas.height + c.r) c.y = -c.r;
      });
      animationFrameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      window.cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login({ email, password }).unwrap();
      localStorage.setItem("token", result.token);
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f3f1fc] p-6 relative overflow-hidden">
      <SEO title="Login Page" description="This is my Login page" />
      {/* Canvas Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full z-0 pointer-events-none"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl w-full overflow-hidden gap-6">
          <motion.aside
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="bg-gradient-to-br from-[#a178ed] to-[#a178ed] text-white px-6 py-8 md:px-10 md:py-12 flex flex-col justify-center gap-6 md:gap-8"
          >
            <article className="flex items-start gap-4">
              <div>
                <h3 className="text-base text-white font-semibold">Welcome back</h3>
                <p className="text-sm text-white">Log in to access your dashboard and projects.</p>
              </div>
            </article>
          </motion.aside>
          <motion.section
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
            className="bg-white px-6 py-8 md:px-10 md:py-12"
          >
            <motion.h2
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="text-2xl font-semibold text-gray-900 mb-8"
            >
              Welcome back!
            </motion.h2>
            <motion.form
              onSubmit={handleLogin}
              className="space-y-6"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
            >
              {[
                {
                  id: "email",
                  label: "Email",
                  type: "email",
                  value: email,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value),
                },
                {
                  id: "password",
                  label: "Password",
                  type: "password",
                  value: password,
                  onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
                    setPassword(e.target.value),
                },
              ].map((input, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <label
                    htmlFor={input.id}
                    className="text-xs font-bold text-gray-600 block mb-1"
                  >
                    {input.label}
                  </label>
                  <input
                    id={input.id}
                    type={input.type}
                    value={input.value}
                    onChange={input.onChange}
                    required
                    placeholder={`Enter your ${input.label.toLowerCase()}`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a77ff2]"
                  />
                </motion.div>
              ))}
              <motion.div
                className="flex justify-between items-center text-sm"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <div className="flex items-center gap-2">
                  <input type="checkbox" id="remember" className="accent-[#a77ff2]" />
                  <label htmlFor="remember" className="text-gray-600">
                    Remember me
                  </label>
                </div>
                <a href="/forgot-password" className="text-[#a77ff2] hover:underline">
                  Forgot password?
                </a>
              </motion.div>
              <motion.button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 bg-[#a178ed] hover:bg-[#915be0] transition text-white rounded-md shadow-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                variants={{
                  hidden: { opacity: 0, scale: 0.95 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: 0.3 }}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </motion.button>
            </motion.form>
            <motion.div
              className="mt-6 text-sm text-center text-gray-600"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.4 }}
            >
              Don't have an account?{" "}
              <button
                onClick={() => navigate("/SignUp")}
                className="text-[#a77ff2] hover:underline font-medium"
              >
                Sign up
              </button>
            </motion.div>
          </motion.section>
        </div>
      </motion.div>
    </main>
  );
};

export default LoginForm;
