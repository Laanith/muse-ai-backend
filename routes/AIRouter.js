const express = require("express");

const isAuthenticated = require("../middlewares/isAuthenticated");
const { geminiController } = require("../controllers/AIController");
const checkApiRequestLimit = require("../middlewares/checkApiRequestLimit");

const AIRouter = express.Router();

AIRouter.post(
  "/generate-content",
  isAuthenticated,
  checkApiRequestLimit,
  geminiController
);

module.exports = AIRouter;
