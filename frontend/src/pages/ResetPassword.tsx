import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4008/password/reset-password", {
        email,
        otp,
        newPassword,
      });
      console.log(res.data);
      toast.success("Password reset successful!");
      navigate("/login");
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f3f1fc] p-6">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-10 max-w-md w-full">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Reset Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="text-xs font-bold text-gray-600 block mb-1">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a77ff2]"
            />
          </div>
          <div>
            <label htmlFor="otp" className="text-xs font-bold text-gray-600 block mb-1">OTP</label>
            <input
              id="otp"
              type="text"
              placeholder="Enter the OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a77ff2]"
            />
          </div>
          <div>
            <label htmlFor="newPassword" className="text-xs font-bold text-gray-600 block mb-1">New Password</label>
            <input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a77ff2]"
            />
          </div>
          <button type="submit" className="w-full py-2 bg-[#a178ed] hover:bg-[#a178ed] transition text-white rounded-md shadow-sm font-medium">
            Reset Password
          </button>
        </form>
      </div>
    </main>
  );
};

export default ResetPassword;
