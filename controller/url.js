import { nanoid } from "nanoid";
import Url from "../model/Url.js";

let urlController = {};

async function createShortUrl(req, res) {
  const { url } = req.body;
  let shortCode;
  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }
  if (!/^https?:\/\/.+\..+/.test(url)) {
    return res.status(400).json({ error: "Invalid URL format" });
  }
  const existingUrlItem = await Url.findOne({ url }, "-accessCount");
  if (existingUrlItem) {
    return res.status(200).json(existingUrlItem);
  }
  try {
    shortCode = nanoid(4);
    const checkExistingShortUrl = await Url.findOne({ shortCode });
    if (checkExistingShortUrl) {
      return res
        .status(400)
        .json({ error: "Short URL already exists. Please request again." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error" });
  }
  let newURLObject;
  console.log(url, shortCode);
  try {
    newURLObject = await Url.create({
      url,
      shortCode,
    });
  } catch (error) {
    return res.status(500).json({ error: "Error creating url object.", error });
  }

  res.status(201).json(newURLObject);
}

async function getShortUrl(req, res) {
  const { shortCode } = req.params;
  if (!shortCode) {
    return res.status(400).json({ error: "Short code is required" });
  }

  try {
    const urlObject = await Url.findOne({ shortCode }, "-accessCount");
    if (!urlObject) {
      res.status(404).json({ message: `Invalid short code.` });
    }
    return res.status(200).json(urlObject);
  } catch (error) {
    res.status(400).json({ error: "Internal server error.", error });
  }
}

async function updateShortUrl(req, res) {
  const { url } = req.body;
  const { shortCode } = req.params;
  if (!url || !shortCode) {
    return res
      .status(400)
      .json({ error: "Please enter the url and shortcode parameter." });
  }
  try {
    const urlObject = await Url.findOne({ shortCode });
    if (!urlObject) {
      return res
        .status(404)
        .json({ error: `Url not exist with ${shortCode} shortcode.` });
    }
    console.log(url, urlObject.url);
    if (url === urlObject.url) {
      return res
        .status(400)
        .json({ error: "Entered url is same as existing url." });
    }
    urlObject.url = url;
    await urlObject.save();
    return res.status(200).json({ urlObject });
  } catch (error) {
    res.status(400).json({ error: "Internal server error.", error });
  }
}

async function deleteShortUrl(req, res) {
  const { shortCode } = req.params;
  if (!shortCode) {
    res
      .status(400)
      .json({ error: "Please provide shortcode in parameter to delete url." });
  }
  try {
    const urlObject = await Url.findOneAndDelete({ shortCode });
    if (!urlObject) {
      res
        .status(404)
        .json({ error: `Url not exist with shorcode ${shortCode}.` });
    }
    res.status(204).json({
      message: "Url deleted successfully.",
    });
  } catch (error) {
    res.status(400).json({ error: "Internal server error." });
  }
}

const getUrlStats = async (req, res) => {
  const { shortCode } = req.params;
  if (!shortCode) {
    res.status(400).json({
      error: "Please provide shortcode in parameter to get url stats.",
    });
  }

  try {
    const urlObject = await Url.findOne({ shortCode });
    if (!urlObject) {
      res.status(404).json({ message: `Invalid short code.` });
    }
    return res.status(200).json(urlObject);
  } catch (error) {
    res.status(400).json({ error: "Internal server error." });
  }
};

urlController.createShortUrl = createShortUrl;
urlController.getShortUrl = getShortUrl;
urlController.updateShortUrl = updateShortUrl;
urlController.deleteShortUrl = deleteShortUrl;
urlController.getUrlStats = getUrlStats;

export default urlController;
