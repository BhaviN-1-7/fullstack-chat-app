import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId,io } from "../lib/socket.js";

//fetch users except us
export const getUsersForSidebar=async (req,res)=>{
    try{
        const loggedInUserId=req.user._id;//this is protected route so we can grab user id form user
        const filteredUsers=await User.find({_id:{$ne:loggedInUserId}}).select("-password");//fetch everything except passwords from users where id != loggedInUserId

        // Get latest message for each user
        const usersWithLatestMessage = await Promise.all(filteredUsers.map(async (user) => {
            const latestMessage = await Message.findOne({
                $or: [
                    { senderId: loggedInUserId, receiverId: user._id },
                    { senderId: user._id, receiverId: loggedInUserId }
                ]
            }).sort({ createdAt: -1 });
            
            return {
                ...user.toObject(),
                lastMessage: latestMessage ? latestMessage.text : null,
                lastMessageTime: latestMessage ? latestMessage.createdAt : null
            };
        }));

        res.status(200).json(usersWithLatestMessage);
    }
    catch (error){
        console.error("Error in getUsersForSidebar: ",error.message);
        res.status(500).json({error:"internal server error"});
    }
};

export const getMessages=async (req,res)=>{
    try{
        const {id:userToChatId}=req.params//other user
        const myId=req.user._id;
        const messages=await Message.find({$or:[{
                senderId:myId,receiverId:userToChatId,
             },
             {
                receiverId:myId,senderId:userToChatId,
             }
    ]}).sort({ createdAt: -1 });

        res.status(200).json(messages);
    }
    catch (error){
        console.error("Error in getMessages: ",error.message);
        res.status(500).json({error:"internal server error"});
    }
};

export const sendMessage=async (req,res)=>
{
    try{
        const {text,image}=req.body;
        const {id:receiverId}=req.params;
        const senderId=req.user._id;

        let imageUrl;
        if(image){
            const uploadResponse=await cloudinary.uploader.upload(image);
            imageUrl=uploadResponse.secure_url;
        }
        const newMessage=new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl,
        });
        await newMessage.save();
        
        //real time functionality goes here > socket.io
        const receiverSocketId=getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        }

        // Emit to all connected clients to update their sidebar
        io.emit("updateLastMessage", {
            senderId,
            receiverId,
            message: newMessage
        });

        res.status(201).json(newMessage);
    }catch (error){
        console.error("Error in sendMessage: ",error.message);
        res.status(500).json({error:"internal server error"});
    }
};