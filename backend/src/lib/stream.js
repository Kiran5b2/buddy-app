import pkg from "stream-chat";
import "dotenv/config";

const { StreamChat } = pkg;
const apiKey=process.env.VIDEO_API_KEY;
const apiSecret=process.env.VIDEO_SECRET_KEY;

if(!apiKey || !apiSecret){
    console.error("Stream API key and secret are required");
}

const streamClient=StreamChat.getInstance(apiKey,apiSecret);

export const upsertStreamUser = async (userdata) => {
    try {
        await streamClient.upsertUser(userdata)
        return userdata;
    } catch (error) {
        console.error("Error in upserting stream user:", error);
        throw error;
    }
}

export const generateStreamToken = (userId) => {
    try {
        const userIdStr = String(userId);
        return streamClient.createToken(userIdStr);
    } catch (error) {
        console.error("Error in generateStreamToken:", error);
        throw error; 
    }
}