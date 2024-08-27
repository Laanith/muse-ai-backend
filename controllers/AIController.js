const asyncHandler = require("express-async-handler");
const axios = require("axios"); // Assuming it's used for external API calls
const ContentHistory = require("../models/ContentHistory");
const User = require("../models/User");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.API_KEY);

// AI CONTROLLER
const geminiController = asyncHandler(async (req, res) => {
  const { prompt } = req.body;
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  console.log("Received prompt:", prompt);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response?.text();
    console.log(content);
    //Create the history
    const newContent = await ContentHistory.create({
      user: req?.user?._id,
      content,
    });
    //Push the content into the user
    const userFound = await User.findById(req?.user?.id);
    userFound.contentHistory.push(newContent?._id);
    //Update the api Request count
    userFound.apiRequestCount += 1;
    await userFound.save();
    res.status(200).json(content);
  } catch (error) {
    throw new Error(error);
  }
});

module.exports = { geminiController };
