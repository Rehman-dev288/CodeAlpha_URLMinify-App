const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const shortid = require('shortid');
require('dotenv').config();

const Url = require('./models/url.js');

const app = express();

// --- MIDDLEWARE ---
app.use(cors({
  origin: ["https://urlminify-app.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "DELETE", "PUT"],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("Database connection failed:", err));

// --- ROUTES (Priority Order: Static > API > Dynamic) ---

// 1. Get All URLs (Analytics)
app.get('/api/urls', async (req, res) => {
    try {
        const urls = await Url.find().sort({ createdAt: -1 });
        res.json(urls);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// 2. Shorten URL Route
app.post('/api/shorten', async (req, res) => {
    try {
        const { longUrl, customCode } = req.body;
        if (!longUrl) return res.status(400).json({ error: 'longUrl is required' });

        let shortCode = customCode || shortid.generate();
        const existing = await Url.findOne({ shortCode });
        
        if (existing) {
            return res.status(400).json({ error: 'Short code already in use.' });
        }

        const url = await Url.create({ longUrl, shortCode });
        return res.status(201).json(url);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// 3. DELETE URL Route (Important: Must be above the redirect route)
app.delete('/api/urls/:identifier', async (req, res) => {
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
            return res.status(404).json({ error: 'URL not found anywhere!' });
        }

        console.log("🗑️ Deleted successfully:", identifier);
        res.json({ message: 'URL deleted successfully' });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 4. Redirect Route (Keep this at the BOTTOM)
app.get('/:shortCode', async (req, res) => {
    try {
        const { shortCode } = req.params;
        
        if (shortCode.startsWith('api')) return;

        const url = await Url.findOne({ shortCode });
        if (url) {
            url.clicks++;
            url.lastClicked = new Date();
            await url.save();
            return res.redirect(url.longUrl);
        } else {
            return res.status(404).send('<h1>URL not found</h1>');
        }
    } catch (error) {
        res.status(500).send('Server Error');
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});