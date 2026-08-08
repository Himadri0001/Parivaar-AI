require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");

const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// =========================
// FILE UPLOAD
// =========================

const upload = multer({
    dest: "uploads/"
});

// =========================
// CHECK API KEY
// =========================

if (!process.env.GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is missing!");
    console.error("Create a .env file and add:");
    console.error("GEMINI_API_KEY=YOUR_API_KEY");
    process.exit(1);
}

// =========================
// GEMINI
// =========================

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const MODEL = "gemini-3.5-flash-lite";

// =========================
// TEST ROUTE
// =========================

app.get("/", (req, res) => {
    res.json({
        status: "online",
        message: "Parivaar AI server is running"
    });
});

// =========================
// CHAT API
// =========================

app.post(
    "/api/chat",
    upload.single("file"),
    async (req, res) => {

        let temporaryFile = null;

        try {

            const message = req.body.message || "";
            const file = req.file;

            // =========================
            // CHECK MESSAGE
            // =========================

            if (!message.trim() && !file) {

                return res.status(400).json({
                    error: "Message or file is required"
                });

            }

            console.log("\n==============================");
            console.log("Parivaar AI request received");
            console.log("==============================");

            console.log("Message:", message);

            // =========================
            // NORMAL TEXT CHAT
            // =========================

            if (!file) {

                console.log("Sending text to Gemini...");
                console.log("Model:", MODEL);

                const response =
                    await ai.models.generateContent({

                        model: MODEL,

                        contents: message

                    });

                console.log("✅ Gemini response received");

                return res.json({
                    reply: response.text || "No response generated."
                });
            }

            // =========================
            // FILE CHAT
            // =========================

            temporaryFile = file.path;

            console.log("File received:");
            console.log("Name:", file.originalname);
            console.log("Type:", file.mimetype);

            // =========================
            // UPLOAD FILE
            // =========================

            console.log("Uploading file to Gemini...");

            const uploadedFile =
                await ai.files.upload({

                    file: file.path,

                    config: {
                        mimeType: file.mimetype
                    }

                });

            console.log("✅ File uploaded");

            console.log("File URI:", uploadedFile.uri);

            // =========================
            // FILE PROMPT
            // =========================

            const prompt =
                message.trim() ||
                "Analyze this file and explain its contents clearly.";

            console.log("Sending file to Gemini...");

            const response =
                await ai.models.generateContent({

                    model: MODEL,

                    contents: [
                        {
                            text: prompt
                        },
                        {
                            fileData: {
                                fileUri: uploadedFile.uri,
                                mimeType: uploadedFile.mimeType
                            }
                        }
                    ]

                });

            console.log("✅ Gemini file response received");

            return res.json({
                reply: response.text || "No response generated."
            });

        } catch (error) {

            console.error("\n❌ GEMINI ERROR");
            console.error("==============================");
            console.error("Message:", error.message);
            console.error("Status:", error.status);
            console.error("Code:", error.code);
            console.error(error);
            console.error("==============================");

            // =========================
            // 429
            // =========================

            if (
                error.status === 429 ||
                error.code === 429
            ) {

                return res.status(429).json({

                    error: "Gemini API quota/rate limit reached.",

                    details:
                        "Your Gemini API request was rejected because the available quota or rate limit was exceeded."

                });

            }

            // =========================
            // 404
            // =========================

            if (
                error.status === 404 ||
                error.code === 404
            ) {

                return res.status(404).json({

                    error: "Gemini model or API endpoint not found.",

                    details:
                        `Model used: ${MODEL}`

                });

            }

            // =========================
            // OTHER ERROR
            // =========================

            return res.status(500).json({

                error: "Gemini request failed",

                details:
                    error.message || "Unknown Gemini error"

            });

        } finally {

            // =========================
            // DELETE LOCAL TEMP FILE
            // =========================

            if (temporaryFile) {

                try {

                    if (fs.existsSync(temporaryFile)) {

                        fs.unlinkSync(temporaryFile);

                        console.log(
                            "Temporary file deleted"
                        );

                    }

                } catch (deleteError) {

                    console.log(
                        "Could not delete temporary file"
                    );

                }

            }

        }

    }
);

// =========================
// START SERVER
// =========================

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Parivaar AI server running on port ${PORT}`);
});