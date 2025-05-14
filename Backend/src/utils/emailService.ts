// utils/emailService.ts
import nodemailer from "nodemailer";

export const sendOTPEmail = async (toEmail: string, otp: string) => {
  try {
    // Create a transporter using your email service (like Gmail, Outlook, etc.)
    const transporter = nodemailer.createTransport({
      service: "Gmail", // Use your preferred service or SMTP
      auth: {
        user: process.env.EMAIL_USER, // your email address
        pass: process.env.EMAIL_PASS, // your email password or app-specific password
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: toEmail,
      subject: "Your OTP Code",
      text: `Your OTP code for password reset is: ${otp}. It will expire in 10 minutes.`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("OTP email sent successfully to:", toEmail);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw new Error("Failed to send OTP email");
  }
};
