const express = require("express");
const app = express();
const PORT = process.env.PORT || 8090;
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cron = require("node-cron");
const cors = require("cors");
const usersRouter = require("./routes/usersRouter");
const { errorHandler } = require("./middlewares/errorMiddleware");
const AIRouter = require("./routes/AIRouter");
const stripeRouter = require("./routes/stripeRouter");

//!database
const connectDB = require("./utils/connectDB");
connectDB();

//CRON
//!Cron for the trial period : run every single day
cron.schedule("0 0 * * * *", async () => {
  console.log("This task runs every second");
  try {
    //get the current date
    const today = new Date();
    const updatedUser = await User.updateMany(
      {
        trialActive: true,
        trialExpires: { $lt: today }, //that means user acc has expired
      }, //users are retreived based on above properties

      {
        //found uders will be modified with below properties
        trialActive: false,
        subscriptionPlan: "Free",
        monthlyRequestCount: 5,
      }
    );
    console.log(updatedUser);
  } catch (error) {
    console.log(error);
  }
});

//!Cron for the Free plan: run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Free",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//!Cron for the Basic plan: run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Basic",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//!Cron for the Premium plan: run at the end of every month
cron.schedule("0 0 1 * * *", async () => {
  try {
    //get the current date
    const today = new Date();
    await User.updateMany(
      {
        subscriptionPlan: "Premium",
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});


//!CORS setup
const corsOptions = {
  origin: "https://muse-ai-frontend.vercel.app",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed methods
  credentials: true, // Allow credentials (cookies, auth headers, etc.)
  allowedHeaders: "Content-Type,Authorization", // Allowed headers
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Explicitly handle preflight OPTIONS requests
app.options('*', cors(corsOptions));

// //!cors
// const corsOptions = {
//   origin: "*",
//   credentials: true, //this arg is for cookies
// };
// app.use(cors(corsOptions));

//!MIDDLEWARES
app.use(express.json()); //to parse incoming json data
app.use(errorHandler); //error handler middleare
app.use(cookieParser()); //to parse cookies

//!ROUTES
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/openai", AIRouter);
app.use("/api/v1/stripe", stripeRouter);

app.get('/', (req,res)=>{
  console.log("Got a GET request to route");
  res.send("Good backend");
})

//!START THE SERVER
app.listen(PORT, console.log(`server is running on PORT:${PORT}`));
