import { Request, Response } from "express";
import User from "../models/password.model";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs"; 

// Send OTP
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email: email.toLowerCase() });  
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOtp = otp;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
    await user.save();

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "visheshsaini0123@gmail.com", 
        pass: "nhlzvarbjlswzzxi", 
      },
    });

    await transporter.sendMail({
      from: "Vishesh <visheshsaini0123@gmail.com>",
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
    });

    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Reset Password
export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;
  try {
    console.log("Received data:", { email, otp, newPassword }); 
    
    const user = await User.findOne({
      email: email.toLowerCase(),
      resetPasswordOtp: { $eq: otp.toString() }, // Safe compare
      resetPasswordExpires: { $gt: new Date() }, // Not expired
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10); // Hash password
    user.password = hashedPassword;
    user.resetPasswordOtp = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successful" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
