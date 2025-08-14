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
          "User-Agent": "Mozilla/5.0"
        }
      }
    );

    const pins = data?.result?.result || [];
    
    const response = {
      success: true,
      data: {
        developer: "MinatoCodes",
        result: {
          query,
          count: pins.length,
          result: pins
            .map(pin => pin.image_url)
            .filter(Boolean)
            .map(url => ({ image_url: url }))
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
  
