const {Resend} = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendOtpEmail = async (email, otp) => {
  try {
    await resend.emails.send({
      from: "projectFlow <onboarding@resend.dev>", 
      to: email,
      subject: "Verify your email - projectFlow",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>Email Verification</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This OTP will expire in 5 minutes.</p>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    throw new Error("Failed to send OTP email");
  }
};