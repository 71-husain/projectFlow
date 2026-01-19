require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes");
const rateLimit = require("express-rate-limit");



const app = express();

app.set("trust proxy", 1);


const corsOptions = {
  origin: [
    "http://localhost:5173",          // local frontend
    "https://project-flow-lake.vercel.app/"    // real Vercel domain
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per IP
  message: "Too many requests, please try again later."
});




//middleware 

app.use(cors(corsOptions));
app.use(helmet());
app.use(limiter);
app.use(express.json());

//database connection 
connectDB();


//Routes
app.use("/api/auth",authRoutes)
app.use("/api/projects",projectRoutes)
app.use("/api/tasks",taskRoutes);


app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    success: false,
    message: "Something went wrong. Please try again later."
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);