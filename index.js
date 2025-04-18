import express from "express";
import dotenv from "dotenv";
import urlRouter from "./routes/url.js";
import mongoose from "mongoose";
import Url from "./model/Url.js";

const app = express();
dotenv.config();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/", urlRouter);
app.get(`/:shortCode`, async (req, res) => {
  const { shortCode } = req.params;
  try {
    const urlObject = await Url.findOneAndUpdate(
      { shortCode },
      {
        $inc: { accessCount: 1 },
      }
    );
    if (!urlObject) {
      res.status(404).json({ error: "Invalid short code." });
    }
    res.redirect(urlObject.url);
  } catch (error) {
    res.status(400).json({ error: "Internal server error." });
  }
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
