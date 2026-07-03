const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const shortid = require("shortid");
require("dotenv").config();

const Url = require("./models/url.js");

const app = express();

// --- MIDDLEWARE ---
app.use(
  cors({
    origin: [
      "https://urlminify-app.vercel.app",
      "http://localhost:5173",
      "http://localhost:5000",
    ],
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- DATABASE CONNECTION ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✨ MongoDB Connected Successfully for URLMinify"))
  .catch((err) => console.error("❌ Database connection failed:", err));

// --- ROUTES (Priority Order: Static > API > Dynamic) ---

// 1. Get All URLs (Analytics)
app.get("/api/urls", async (req, res) => {
  try {
    const urls = await Url.find().sort({ createdAt: -1 });
    res.json(urls);
  } catch (error) {
    console.error("Fetch URLs Error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// 2. Shorten URL Route
app.post("/api/shorten", async (req, res) => {
  try {
    let { longUrl, customCode } = req.body;
    if (!longUrl) return res.status(400).json({ error: "longUrl is required" });

    // Protocol Check: Agar user http ya https likhna bhool jaye, toh automated prepend karein
    if (!longUrl.startsWith("http://") && !longUrl.startsWith("https://")) {
      longUrl = `https://${longUrl}`;
    }

    let shortCode = customCode || shortid.generate();
    const existing = await Url.findOne({ shortCode });

    if (existing) {
      return res.status(400).json({ error: "Short code already in use." });
    }

    const url = await Url.create({ longUrl, shortCode });
    return res.status(201).json(url);
  } catch (error) {
    console.error("Shorten Error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

// 3. DELETE URL Route
app.delete("/api/urls/:identifier", async (req, res) => {
  try {
    const { identifier } = req.params;
    let deletedUrl;

    if (mongoose.Types.ObjectId.isValid(identifier)) {
      deletedUrl = await Url.findByIdAndDelete(identifier);
    }

    if (!deletedUrl) {
      deletedUrl = await Url.findOneAndDelete({ shortCode: identifier });
    }

    if (!deletedUrl) {
      return res.status(404).json({ error: "URL not found anywhere!" });
    }

    console.log("🗑️ Deleted successfully:", identifier);
    res.json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error("Delete Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 4. Redirect Route (Keep this at the absolute BOTTOM)
app.get("/:shortCode", async (req, res) => {
  try {
    const { shortCode } = req.params;

    if (shortCode.startsWith("api")) {
      return res.status(404).json({ error: "Invalid API Endpoint" });
    }

    const url = await Url.findOne({ shortCode });
    if (url) {
      url.clicks++;
      url.lastClicked = new Date();
      await url.save();

      return res.redirect(url.longUrl);
    } else {
      return res
        .status(404)
        .send("<h1>🔍 URLMinify Error: Short Link Not Found</h1>");
    }
  } catch (error) {
    console.error("Redirection Error:", error);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 URLMinify Server running on port ${PORT}`);
});
