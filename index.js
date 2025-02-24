require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const connectDB = require("../stackblitz-PractiseAssignment1/db/db");

const app = express();
app.use(express.json());
app.use(cors());

const connectDB = () => {
  mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to database"))
  .catch((error) => console.error("Error connecting to database:", error.message))};

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  age: { type: Number, required: true },
});

const User = mongoose.model("User", userSchema);

app.post("/api/users", async (req, res) => {
  try {
    const { name, email, age } = req.body;

    if (!name || !email || !age) {
      return res.status(400).json({ message: "All fields (name, email, age) are required" });
    }
    const newUser = new User({ name, email, age });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Validation error", error: error.message });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  connectDB();
console.log(`Server running on port ${PORT}`)
});
