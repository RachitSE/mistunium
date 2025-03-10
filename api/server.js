import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();
const app = express();
const port = 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.get("/api/memories", async (req, res) => {
  try {
    const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Use the search API to fetch images with metadata
    const response = await axios.get(
      `https://api.cloudinary.com/v1_1/dmibsjyf5/resources/image/search`,
      {
        auth: {
          username: apiKey,
          password: apiSecret,
        },
      }
    );

    console.log(response.data.resources);


    const memories = response.data.resources.map((item) => ({
      id: item.public_id,
      img: item.secure_url,
      title: item.context?.custom?.title || item.public_id.split("/").pop(),
      caption: item.context?.custom?.caption || "No caption added",
      date: new Date(item.created_at).toLocaleString(),
    }));

    res.json(memories);
  } catch (error) {
    console.error("Failed to fetch images:", error.response?.data || error.message);
    res.status(500).send("Failed to fetch memories");
  }
});


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  
});

