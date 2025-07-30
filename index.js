const express = require("express");
const axios = require("axios");
const cors = require("cors");
const author = "MinatoCodes";

const app = express();
app.use(cors());

app.get("/api/pinterest", async (req, res) => {
  const query = req.query.q;
  const limit = Math.min(parseInt(req.query.count) || 5, 10);

  if (!query) return res.status(400).json({ error: "Missing query param ?q=" });

  try {
    const { data } = await axios.get(`https://backend1.tioo.eu.org/pinterest?q=${encodeURIComponent(query)}`);
    const results = data?.result?.result;

    if (!Array.isArray(results)) {
      return res.status(500).json({ error: "Invalid API response format" });
    }

    const images = results.slice(0, limit).map(item => ({
      image_url: item.image_url
    }));

    return res.json({
      query,
      author: author,
      count: images.length,
      images
    });
  } catch (err) {
    return res.status(500).json({
      error: "Error fetching Pinterest images",
      message: err.message
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`📦 Pinterest API live at http://localhost:${PORT}/api/pinterest?q=...&count=...`);
});
                                  
