const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/api/pinterest", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ success: false, error: "Missing query param ?q=" });

  try {
    const { data } = await axios.get(
      `https://secret-pin-minato.vercel.app/api/pinterest?q=${encodeURIComponent(query)}`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/115.0.0.0 Safari/537.36"
        }
      }
    );

    const results = data?.result?.result;
    if (!Array.isArray(results)) {
      return res.status(500).json({ success: false, error: "Invalid API response format" });
    }

    // Extract only image_url
    const images = results
      .map(item => item.image_url)
      .filter(Boolean);

    const response = {
      success: true,
      data: {
        developer: "MinatoCodes",
        result: {
          query,
          count: images.length,
          images
        }
      }
    };

    res.json(response);

  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Failed to fetch Pinterest images",
      message: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Pinterest API running at http://localhost:${PORT}/api/pinterest?q=...`);
});
