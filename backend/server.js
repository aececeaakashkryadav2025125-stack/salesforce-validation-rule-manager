const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// GET RULES
app.post("/get-rules", (req, res) => {
  const dummyData = [
    { Id: "1", Name: "Rule A", Active: true },
    { Id: "2", Name: "Rule B", Active: false }
  ];

  res.json({ success: true, data: dummyData });
});

// TOGGLE RULE
app.post("/toggle-rule", (req, res) => {
  res.json({ success: true });
});

// 🔥 IMPORTANT FIX
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
