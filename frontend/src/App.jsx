const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// TEST ROUTE
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// 🔥 GET RULES
app.post("/get-rules", async (req, res) => {
  try {
    const { token, instance } = req.body;

    if (!token || !instance) {
      return res.json({ success: false, error: "Missing token or instance" });
    }

    // ⚠️ Dummy data (replace with Salesforce API if needed)
    const dummyData = [
      { Id: "1", Name: "Rule A", Active: true },
      { Id: "2", Name: "Rule B", Active: false }
    ];

    res.json({ success: true, data: dummyData });

  } catch (err) {
    console.error(err);
    res.json({ success: false, error: "Server error" });
  }
});

// 🔁 TOGGLE RULE
app.post("/toggle-rule", async (req, res) => {
  try {
    const { id, active } = req.body;

    console.log("Toggling:", id, active);

    // simulate success
    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.json({ success: false, error: "Toggle failed" });
  }
});

// 🔥 IMPORTANT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
