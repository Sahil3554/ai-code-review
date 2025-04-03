import { Octokit } from "@octokit/rest";
import { config } from "dotenv";

config(); // Load environment variables

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN, // GitHub Personal Access Token
});

/**
 * Fetch PR details from GitHub API
 */
export async function getPRDetails(owner: string, repo: string, prNumber: number) {
    try {
        const { data } = await octokit.pulls.get({
            owner,
            repo,
            pull_number: prNumber
        });

        return {
            title: data.title,
            author: data.user?.login,
            files_changed: data.changed_files,
            additions: data.additions,
            deletions: data.deletions,
            url: data.html_url
        };
    } catch (error) {
        console.error("❌ Error fetching PR details:", error);
        return null;
    }
}

/**
 * Fetch modified files in a PR
 */
export async function getPRFiles(owner: string, repo: string, prNumber: number) {
    try {
        const { data } = await octokit.pulls.listFiles({
            owner,
            repo,
            pull_number: prNumber
        });

        return data.map(file => ({
            filename: file.filename,
            status: file.status,
            changes: file.changes
        }));
    } catch (error) {
        console.error("❌ Error fetching PR files:", error);
        return [];
    }
}
