
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Resend } from "resend";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.join(__dirname, "..", "public");

app.use(express.static(frontendPath));

// CORS Configuration
app.use(cors({
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500",
    "https://my-portfolio-4h3f.onrender.com"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

// Resend Configuration
const resend = new Resend(process.env.RESEND_API_KEY);

// Test Route
app.get("/", (req, res) => {
  res.send("Portfolio backend is running!");
});

// Contact Form Route
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields."
      });
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email."
      });
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: ["sakshisuman25@navgurukul.org"],
      replyTo: email,
      subject: `Portfolio message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    });

    if (error) {
      console.error("Resend error:", error);

      return res.status(500).json({
        success: false,
        message: "Email could not be sent."
      });
    }

    console.log("Email sent successfully:", data.id);

    return res.status(200).json({
      success: true,
      message: "Your message was sent successfully!"
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again."
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
