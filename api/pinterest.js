const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/pinterest", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing query param ?q=" });

  try {
    const { data } = await axios.get(`https://backend1.tioo.eu.org/pinterest?q=${encodeURIComponent(query)}`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115.0.0.0 Safari/537.36"
      }
    });

    const results = data?.result?.result;
    if (!Array.isArray(results)) {
      return res.status(500).json({ error: "Invalid API response format" });
    }

    // Map all results to HD original images
    const images = results.map(item => ({
      image_url: item.images?.original || item.image_url // fallback to image_url if original missing
    })).filter(Boolean);

    res.json({
      query,
      count: images.length,
      images
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to fetch Pinterest images",
      message: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Pinterest API running at http://localhost:${PORT}/api/pinterest?q=...`);
});
                                   
