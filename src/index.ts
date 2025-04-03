import express, { Request, Response } from "express";
import { config } from "dotenv";
import { getPRDetails, getPRFiles } from "./github";

config(); // Load environment variables

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// GitHub Webhook Endpoint
app.post("/webhook", async (req: Request, res: Response): Promise<any> => {
    try {
        const eventType = req.headers["x-github-event"];
        if (eventType !== "pull_request") {
            return res.status(400).send("Not a PR event");
        }

        const { action, repository, pull_request } = req.body;
        if (!pull_request || action !== "opened") {
            return res.status(200).send("No action needed");
        }

        const owner = repository.owner.login;
        const repo = repository.name;
        const prNumber = pull_request.number;

        console.log(`📥 Received PR #${prNumber} from ${owner}/${repo}`);

        // Fetch PR details
        const prDetails = await getPRDetails(owner, repo, prNumber);
        console.log("🔹 PR Details:", prDetails);

        // Fetch modified files
        const modifiedFiles = await getPRFiles(owner, repo, prNumber);
        console.log("📂 Modified Files:", modifiedFiles);

        res.status(200).json({
            message: "PR data fetched",
            prDetails,
            modifiedFiles
        });

    } catch (error) {
        console.error("❌ Webhook error:", error);
        res.status(500).send("Server Error");
    }
});


app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
