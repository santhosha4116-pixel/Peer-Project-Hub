require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const projectRoutes = require("./routes/projectRoutes");
const commentRoutes = require("./routes/commentRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Peer Project Hub API is running" });
});

app.use("/api/projects", projectRoutes);
app.use("/api", commentRoutes);
app.use("/api/bookmarks", bookmarkRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});