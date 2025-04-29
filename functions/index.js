
const functions = require("firebase-functions");
const { Octokit } = require("@octokit/rest");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK (if not already done elsewhere)
// You only need this if you're interacting with other Firebase services,
// otherwise, it's not strictly necessary for just using functions.config().
// admin.initializeApp();

// Helper function to safely get Firebase function config
const getConfig = (key) => {
    try {
        return functions.config().github[key];
    } catch (e) {
        console.error(`Missing Firebase function config key: github.${key}`);
        return null;
    }
};

// GitHub configuration from Firebase environment variables
// Set these using the Firebase CLI:
// firebase functions:config:set github.token="YOUR_GITHUB_PAT"
// firebase functions:config:set github.owner="YOUR_GITHUB_USERNAME"
// firebase functions:config:set github.repo="YOUR_REPO_NAME"
// firebase functions:config:set github.path="src/lib/data/tools.json" // Or the correct path
// firebase functions:config:set github.branch="main" // Or your default branch

const GITHUB_TOKEN = getConfig("token");
const GITHUB_OWNER = getConfig("owner");
const GITHUB_REPO = getConfig("repo");
const FILE_PATH = getConfig("path");
const BRANCH = getConfig("branch");


/**
 * Validates the incoming tool data.
 * @param {object} toolData The tool data received in the request body.
 * @return {boolean} True if the data is valid, false otherwise.
 */
const validateToolData = (toolData) => {
    const requiredFields = [
        "id",
        "name",
        "categorySlug",
        "isFree",
        "rating",
        "summary",
        "description",
        "websiteLink",
        "tags",
    ];
    if (!toolData) {
        console.error("Validation Error: No tool data received.");
        return false;
    }
    for (const field of requiredFields) {
        if (toolData[field] === undefined || toolData[field] === null || (typeof toolData[field] === 'string' && toolData[field].trim() === '')) {
            // Allow rating 0, but not null/undefined
             if (field === 'rating' && toolData[field] === 0) {
                 continue;
             }
             // Allow isFree to be false
             if (field === 'isFree' && toolData[field] === false) {
                 continue;
             }
             // Allow empty optional fields like usageSteps, image (if optional)
             if (field === 'usageSteps' || field === 'image' || field === 'tags') {
                 // If 'image' is optional and empty, it's fine
                 if (field === 'image' && toolData[field] === '') continue;
                 // If 'usageSteps' or 'tags' are optional and empty arrays/strings, it's fine
                 if ((field === 'usageSteps' || field === 'tags') && (Array.isArray(toolData[field]) && toolData[field].length === 0 || toolData[field] === '')) continue;
                 // Allow empty optional string fields
                 if (typeof toolData[field] === 'string' && toolData[field].trim() === '') continue;
             }

            console.error(`Validation Error: Missing or empty required field: ${field}`);
            return false;
        }
    }
    // Add more specific validation if needed (e.g., rating range, URL format)
    if (typeof toolData.rating !== 'number' || toolData.rating < 0 || toolData.rating > 5) {
        console.error(`Validation Error: Invalid rating value: ${toolData.rating}`);
        return false;
    }
     if (typeof toolData.isFree !== 'boolean') {
        console.error(`Validation Error: isFree must be a boolean.`);
        return false;
    }
    try {
        new URL(toolData.websiteLink);
    } catch (_) {
        console.error(`Validation Error: Invalid websiteLink URL: ${toolData.websiteLink}`);
        return false;
    }

    console.log("Tool data validation successful.");
    return true;
};


/**
 * Firebase Cloud Function to update tools.json on GitHub.
 * Triggered by HTTP POST request.
 */
exports.updateToolJson = functions.https.onRequest(async (req, res) => {
    // Set CORS headers for preflight requests and actual requests
    // Adjust origin ('*') to your specific frontend URL in production for security
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Add Authorization if needed later

    if (req.method === "OPTIONS") {
        // Send response to OPTIONS preflight request
        res.status(204).send("");
        return;
    }

    // Only allow POST requests for the actual update
    if (req.method !== "POST") {
        console.log(`Method ${req.method} not allowed.`);
        res.status(405).send("Method Not Allowed");
        return;
    }

    // Check if essential GitHub config is present
    if (!GITHUB_TOKEN || !GITHUB_OWNER || !GITHUB_REPO || !FILE_PATH || !BRANCH) {
        console.error("GitHub configuration missing in Firebase environment variables.");
        res.status(500).send("Server configuration error.");
        return;
    }

    const newTool = req.body;
    console.log("Received tool data:", JSON.stringify(newTool, null, 2));

    // Validate the incoming data
    if (!validateToolData(newTool)) {
        console.log("Invalid tool data received.");
        res.status(400).send("Invalid tool data.");
        return;
    }

    const octokit = new Octokit({ auth: GITHUB_TOKEN });
    const commitMessage = `feat: Add new tool "${newTool.name}" via Admin Dashboard`;

    try {
        // 1. Get the current content of tools.json
        console.log(`Fetching file content for: ${FILE_PATH} from ${GITHUB_OWNER}/${GITHUB_REPO} on branch ${BRANCH}`);
        const { data: fileData } = await octokit.rest.repos.getContent({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: FILE_PATH,
            ref: BRANCH, // Specify the branch
        });

        if (!fileData || typeof fileData.content !== 'string' || typeof fileData.sha !== 'string') {
             throw new Error("Invalid file data received from GitHub.");
        }

        const currentContentBase64 = fileData.content;
        const currentSha = fileData.sha;
        console.log(`Successfully fetched file. SHA: ${currentSha}`);

        // 2. Decode, parse, and append
        const currentContent = Buffer.from(currentContentBase64, "base64").toString("utf-8");
        let toolsArray = JSON.parse(currentContent);

        // Ensure it's an array
        if (!Array.isArray(toolsArray)) {
             console.error("Error: Parsed tools.json content is not an array.");
             throw new Error("Invalid JSON structure in repository file.");
        }

        // Check if tool with the same ID already exists (optional but recommended)
        if (toolsArray.some(tool => tool.id === newTool.id)) {
             console.warn(`Tool with ID "${newTool.id}" already exists. Aborting.`);
             res.status(409).send(`Tool with ID "${newTool.id}" already exists.`);
             return;
        }

        toolsArray.push(newTool);
        console.log(`Appended new tool. Total tools: ${toolsArray.length}`);


        // 3. Encode and update back to GitHub
        // Use JSON.stringify with indentation for pretty formatting
        const updatedContent = JSON.stringify(toolsArray, null, 2); // 2 spaces indentation
        const updatedContentBase64 = Buffer.from(updatedContent).toString("base64");

        console.log("Attempting to update file on GitHub...");
        await octokit.rest.repos.createOrUpdateFileContents({
            owner: GITHUB_OWNER,
            repo: GITHUB_REPO,
            path: FILE_PATH,
            message: commitMessage,
            content: updatedContentBase64,
            sha: currentSha, // Required for updating existing files
            branch: BRANCH, // Specify the branch
        });

        console.log("Successfully updated tools.json on GitHub.");
        res.status(200).send({ message: "Tool added successfully to GitHub!" });

    } catch (error) {
        console.error("Error interacting with GitHub:", error);
        if (error.status === 404) {
            res.status(404).send(`File not found at path: ${FILE_PATH}. Check configuration.`);
        } else if (error.status === 409) {
            // Handle potential conflict (file changed since last fetch) - more robust handling needed for production
             console.error("GitHub Error 409: Conflict detected. The file may have been updated by another process.");
             res.status(409).send("Conflict updating file on GitHub. Please try again.");
        } else {
            res.status(500).send(`Error updating file on GitHub: ${error.message || 'Unknown error'}`);
        }
    }
});
