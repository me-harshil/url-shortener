import express from "express";
import urlController from "../controller/url.js";

const urlRouter = express.Router();

urlRouter.post("/shorten", urlController.createShortUrl);

urlRouter
  .get("/shorten/:shortCode", urlController.getShortUrl)
  .put("/shorten/:shortCode", urlController.updateShortUrl)
  .delete("/shorten/:shortCode", urlController.deleteShortUrl);

urlRouter.get("/shorten/:shortCode/stats", urlController.getUrlStats);

export default urlRouter;
