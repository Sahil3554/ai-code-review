import express from "express";
import { config } from "dotenv";

config(); // Load environment variables

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// GitHub Webhook Endpoint
app.post("/webhook", (req, res) => {
    console.log("🔹 Received GitHub PR Event:", req.body);
    res.sendStatus(200);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
