require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require('./routes/auth.routes');
const projectRoutes = require("./routes/project.routes");
const taskRoutes = require("./routes/task.routes");


const app = express();

//middleware 

app.use(cors());
app.use(express.json());

//database connection 
connectDB();


//Routes
app.use("/api/auth",authRoutes)
app.use("/api/projects",projectRoutes)
app.use("/api/tasks",taskRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);