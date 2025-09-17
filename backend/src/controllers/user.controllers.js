import User from "../models/User.js";
import FriendRequest from "../models/friendRequest.model.js";

export async function getRecommendedUsers(req, res) {
    try {
        const currentUserId = req.user.id;
        const currentUser = req.user

        const recommendedUsers = await User.find({
            $and:[
                {_id:{$ne:currentUserId}},
                {_id:{$nin:currentUser.friends}},
                {isOnboarded:true}
            ]
        })
        res.status(200).json({success:true, users:recommendedUsers})
    } catch (error) {
        res.status(500).json({success:false, message:"Internal server error"})
        console.log("Error in getRecommendedUsers:", error.message);
    }
}

export async function getMyFriends(req, res) {
  try {
    const user = await User.findById(req.user.id)
      .select("friends")
      .populate("friends", "fullName profilePic nativelanguage");

    res.status(200).json(user.friends);
  } catch (error) {
    console.error("Error in getMyFriends controller", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function sendFriendRequest(req, res) {
    
    try {
        const myId = req.user.id;
        const {id:recipientId} = req.params;
        if (myId === recipientId) {
            return res.status(400).json({ success: false, message: "You cannot send a friend request to yourself." });
        }

        const recipient = await User.findById(recipientId);
        if (!recipient) {
            return res.status(404).json({ success: false, message: "Recipient user not found." });
        }
        if(recipient.friends.includes(myId)){
            return res.status(400).json({ success: false, message: "You are already friends with this user." });
        }

        const existingRequest = await FriendRequest.findOne({
            $or: [
                { sender: myId, recipient: recipientId },
                { sender: recipientId, recipient: myId }
            ],
            status: "pending"
        })
        if (existingRequest) {
            return res.status(400).json({ success: false, message: "A pending friend request already exists between you and this user." });
        }
        const friendRequest = await FriendRequest.create({
            sender: myId,
            recipient: recipientId
        });
        res.status(200).json({ success: true, message: "Friend request sent successfully.", friendRequest , recipientId, });
    } catch (error) {
        console.log("Error in sendFriendRequest:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function acceptFriendRequest(req, res) {
    try {
        const {id:requestId} = req.params;
        const friendRequest = await FriendRequest.findById(requestId);
        if(!friendRequest){
            return res.status(404).json({success:false,message:"Friend request not found"})
        }
        if(friendRequest.recipient.toString() !== req.user.id){
            return res.status(403).json({success:false,message:"You are not authorized to accept this friend request"})
        }
        friendRequest.status = "accepted";
        await friendRequest.save();

        await User.findByIdAndUpdate(req.user.id,{$push:{friends:friendRequest.sender}});
        await User.findByIdAndUpdate(friendRequest.sender,{$push:{friends:friendRequest.recipient}});

        res.status(200).json({success:true,message:"Friend request accepted", friendRequest});

    } catch (error) {
        console.log("Error in acceptFriendRequest:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function getFriendRequests(req, res) {
    try {
        const incomingRequests = await FriendRequest.find({recipient:req.user.id, status:"pending"}).populate("sender","fullname profilepic  ");
        
        res.status(200).json({success:true, incomingRequests});
    } catch (error) {
        console.log("Error in getFriendRequests:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export async function outgoingFriendRequests(req, res) {
    try {
        const outgoingRequests = await FriendRequest.find({sender:req.user.id, status:"pending"}).populate("recipient","fullname profilePic  ");
        res.status(200).json({success:true, outgoingRequests});
    } catch (error) {
        console.log("Error in outgoingFriendRequests:", error.message);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}