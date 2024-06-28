import { compare } from 'bcrypt';
import { User } from '../models/user.js';
import { cookieOptions, emitEvent, sendToken, uploadFilesToCloudinary } from '../utils/features.js';
import { TryCatch } from '../middlewares/error.js';
import { ErrorHandler } from '../utils/utility.js';
import { Chat } from '../models/chat.js';
import {Request} from '../models/request.js';
import { NEW_REQUEST, REFETCH_CHATS } from '../constants/events.js';
import { getOtherMember } from '../lib/helper.js';


const newUser = TryCatch(async (req, res, next) => {
    const { name, username, password, bio } = req.body;
    const file=req.file

    if(!file) return next(new ErrorHandler("Please Upload avatar"));

    const result=await uploadFilesToCloudinary([file]);

    const avatar = {
        public_id: result[0].public_id,
        url: result[0].url,
    };
    const user = await User.create({ name, bio, username, password, avatar });
    sendToken(res, user, 201, "User Created");
});

const login = TryCatch(async (req, res, next) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).select("+password");
    if (!user) return next(new ErrorHandler("Invalid Username or Password", 404));

    const isMatch = await compare(password, user.password);
    if (!isMatch) return next(new Error("Invalid Password"));

    sendToken(res, user, 200, `Welcome Back, ${user.name}`);
});

const getMyProfile = TryCatch(async (req, res,next) => {
    const user = await User.findById(req.user).select("-password");
    console.log(user);
    res.status(200).json({
        success: true,
        user,
    });
});

const logout = TryCatch(async (req, res) => {
    return res.status(200).cookie("Z-Chat-token", "", { ...cookieOptions, maxAge: 0 }).json({
        success: true,
        message: "Logged out successfully",
    });
});

const searchUser = TryCatch(async (req, res) => {
    const { name } = req.query;



    const myChats=await Chat.find({ groupChat:false,members:req.user});

    const allUsersFromMyChats=myChats.map((chat)=>chat.members).flat();

    const allUserExceptMeAndFriends=await User.find({
        _id:{$nin:allUsersFromMyChats},
        name:{$regex :name,$options:"i"},
    });

    const users=allUserExceptMeAndFriends.map(({_id,name,avatar})=>({_id,name,avatar:avatar}))


    return res.status(200).json({
        success: true,
        users,
    });
});


const sendFriendRequest = TryCatch(async (req, res, next) => {
    const { userId } = req.body;
  
    const request = await Request.findOne({
      $or: [
        { sender: req.user, receiver: userId },
        { sender: userId, receiver: req.user },
      ],
    });
  
    if (request) return next(new ErrorHandler("Request already sent", 400));
  
    await Request.create({
      sender: req.user,
      receiver: userId,
    });
  
    emitEvent(req, NEW_REQUEST, [userId]);
  
    return res.status(200).json({
      success: true,
      message: "Friend Request Sent",
    });
  });


  const acceptFriendRequest = TryCatch(async (req, res, next) => {
    const { requestId, accept } = req.body;

    const request = await Request.findById(requestId)
        .populate("sender", "name")
        .populate("receiver", "name");

    if (!request) return next(new ErrorHandler("Request not found", 404));

    // Log the values for debugging
    console.log(`Request Receiver: ${request.receiver._id}, User: ${req.user}`);

    // Ensure proper comparison
    if (request.receiver._id.toString() !== req.user.toString()) {
        return next(new ErrorHandler("You are not authorized to accept this request", 401));
    }

    if (!accept) {
        await request.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Request Rejected",
        });
    }

    const members = [request.sender._id, request.receiver._id];

    await Promise.all([
        Chat.create({
            members,
            name: `${request.sender.name} - ${request.receiver.name}`,
        }),
        request.deleteOne()
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    return res.status(200).json({
        success: true,
        message: "Friend Request Accepted",
        senderId: request.sender._id,
    });
});




const getMyNotifications = TryCatch(async (req, res) => {
    const requests = await Request.find({ receiver: req.user }).populate(
      "sender",
      "name avatar"
    );
  
    const allRequests = requests.map(({ _id, sender }) => ({
      _id,
      sender: {
        _id: sender._id,
        name: sender.name,
        avatar: sender.avatar.url,
      },
    }));
  
    return res.status(200).json({
      success: true,
      allRequests,
    });
  });


  const getMyFriends = TryCatch(async (req, res) => {
    const chatId = req.query.chatId;
  
    const chats = await Chat.find({
      members: req.user,
      groupChat: false,
    }).populate("members", "name avatar");
  
    const friends = chats.map((chat) => {
      const otherUser = getOtherMember(chat.members, req.user);
      
      // Logging for debugging
      console.log(`Chat ID: ${chat._id}, Other Member: ${JSON.stringify(otherUser)}`);
      
      // Check if otherUser is found
      if (!otherUser) {
        return null;
      }
  
      return {
        _id: otherUser._id,
        name: otherUser.name,
        avatar: otherUser.avatar.url,
      };
    }).filter(friend => friend !== null); // Filter out any null entries
  
    if (chatId) {
      const chat = await Chat.findById(chatId);
  
      const availableFriends = friends.filter(
        (friend) => !chat.members.includes(friend._id)
      );
  
      return res.status(200).json({
        success: true,
        availableFriends,
      });
    } else {
      return res.status(200).json({
        success: true,
        friends,
      });
    }
  });
  
  

export { login, newUser, getMyProfile, logout, searchUser,sendFriendRequest,acceptFriendRequest,getMyNotifications,getMyFriends };
