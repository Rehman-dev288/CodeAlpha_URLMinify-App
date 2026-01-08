const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const shortid = require('shortid');
require('dotenv').config();

const Url = require('./models/Url'); // Make sure path is correct

const app = express();

// --- MIDDLEWARE (Order is very important) ---
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Database synchronization established."))
.catch(err => console.error("Database connection failed:", err));

// --- ROUTES ---

// 1. Shorten URL Route
app.post('/api/shorten', async (req, res) => {
    try {
        console.log("Data received from frontend:", req.body);

        const { longUrl, customCode } = req.body;

        if (!longUrl) {
            return res.status(400).json({ error: 'longUrl is required' });
        }

        let shortCode = customCode || shortid.generate();

        const existing = await Url.findOne({ shortCode });
        if (existing) {
            return res.status(400).json({ error: 'Short code already in use.' });
        }

        const url = await Url.create({ 
            longUrl, 
            shortCode 
        });

        console.log("URL created successfully:", url);
        return res.status(201).json(url);
    } catch (error) {
        console.error("Backend Error Detail:", error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
});

// 2. Redirect Route
app.get('/:shortCode', async (req, res) => {
    try {
        const { shortCode } = req.params;
        const url = await Url.findOne({ shortCode });

        if (url) {
            url.clicks++;
            url.lastClicked = new Date();
            await url.save();
            return res.redirect(url.longUrl);
        } else {
            return res.status(404).json({ error: 'URL not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

// 3. Get All URLs (Analytics)
app.get('/api/urls', async (req, res) => {
    try {
        const urls = await Url.find().sort({ createdAt: -1 });
        res.json(urls);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Inbound requests listening on port ${PORT}`);
});