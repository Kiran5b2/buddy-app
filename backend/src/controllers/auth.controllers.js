import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { upsertStreamUser } from "../lib/stream.js";

export const signIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const user = await User.findOne({email});
        if(!user) return res.status(401).json({message:"Invalid credentials"});

        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV==="production",
        })

        res.status(200).json({success:true,user})

    } catch (error) {
        console.log("Error in signIn:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const signUp = async (req, res) => {
    const { fullname, email, password } = req.body;
    try {
        if (!fullname || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
        return res.status(400).json({ message: "Invalid email format" });
        }

        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already in use"});
        }

        const idx = Math.floor(Math.random() * 100) + 1;
        const randomAvartar = `https://avatar.iran.liara.run/public/${idx}.png`;

        const newUser = await User.create({
            fullname,
            email,
            password,
            profilepic: randomAvartar
        });

        try {
            await upsertStreamUser({
            id: newUser._id.toString(),
            name: newUser.fullname,
            image: newUser.profilepic || "",
        })
        console.log(`Stream user created for ${newUser.fullname}`);
        } catch (error) {
            console.log("Error in upserting stream user:", error);
        }

        const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("jwt",token,{
            maxAge:7*24*60*60*1000,
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV==="production",
        })

        res.status(201).json({success:true,user:newUser})


    } catch (error) {
        console.log("Error in signUp:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const logOut = (req, res) => {
    res.clearCookie("jwt")
    res.status(200).json({success:true,message:"Logged out successfully"})
} 

export const onboard = async (req, res) => {
    try {
        const userId = req.user._id;
        const { fullname, bio, location, nativelanguage } = req.body;
        if (!fullname || !bio || !location || !nativelanguage) {
            return res.status(400).json({ message: "All fields are required",
                missingFields:[
            !fullname && "fullname",
            !bio && "bio",
            !location && "location",
            !nativelanguage && "nativelanguage",].filter(Boolean),
         });
    }
    const updatedUser = await User.findByIdAndUpdate(userId, 
            {...req.body, isOnboarded: true }, 
            { new: true })
            if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        try {
            await upsertStreamUser({
            id: updatedUser._id.toString(),
            name: updatedUser.fullname,
            image: updatedUser.profilepic || "",  
        })
        console.log(`Stream user updated after onboarding for ${updatedUser.fullname}`);
        } catch (error) {
            console.log("Error in upserting stream user during onboarding:", error);
            res.status(500).json({ message: "Error updating stream user" });
        }
        res.status(200).json({ success: true, user: updatedUser });
    } catch (error) {
        console.log("Error in onboard:", error);
        return res.status(500).json({ message: "Internal server error",
         });
    }
}