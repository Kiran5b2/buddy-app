import { generateStreamToken } from "../lib/stream.js";

export async function getStreamToken(req, res) {
    try {
        const userId = req.user.id;
        const streamToken = await generateStreamToken(userId);
        res.status(200).json({ success: true, token: streamToken });
    } catch (error) {
        console.log("Error in getStreamToken:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}    