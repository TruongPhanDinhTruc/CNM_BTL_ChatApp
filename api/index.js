const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;


const app = express();
const port = 8000;
const secretKey = "g!cUnGDu0C"
const cors = require('cors');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(passport.initialize());
const jwt = require('jsonwebtoken');

mongoose.connect(
    "mongodb+srv://truongphandinhtruc:Minecraft2310@cluster0.ywmtbdy.mongodb.net/",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
).then(() => {
    console.log("Connected to Mongo Db");
}).catch((error) => {
    console.log("Error to connecting to MongoDb", error);
})

app.listen(port, () => {
    console.log("Server running on port 8000");
})

const User = require('./models/user');
const Message = require('./models/message');
const Group = require('./models/group');
const GroupMessage = require('./models/group-message');

//Dang ky

app.post("/register", (req, res) => {
    const { name, email, password, image } = req.body;

    const newUser = new User({ name, email, password, image });

    newUser.save().then(() => {
        res.status(200).json({ message: "User register successfully" })
    }).catch((error) => {
        console.log("Error registering user", error);
        res.status(500).json({ error: "Error registering the user" })
    });
});

//Tao token cho user
const createToken = (userId) => {
    const payload = {
        userId: userId,
    };
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });

    return token;
}

//Dang nhap
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(404).json({ message: "Email and the password are required" });
    }

    User.findOne({ email }).then((user) => {
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const token = createToken(user._id);
        res.status(200).json({ token });
    }).catch((error) => {
        console.log("Error in finding the user", error);
        res.status(500).json({ error: "Internal server Error" });
    })
});

// endpoint de truy cap tat ca users ngoai tru user dang dang nhap
app.get("/users/:userId", (req, res) => {
    const loggedInUserId = req.params.userId;

    User.find({ _id: { $ne: loggedInUserId } }).then((users) => {
        res.status(200).json(users);
    }).catch((err) => {
        console.log("Error retrieving users", err);
        res.status(500).json({ error: "Error retrieving users" });
    })
});

// profile
app.get("/profile/:userId", (req, res) => {
    const requestedUserId = req.params.userId;

    User.findById(requestedUserId).then((user) => {
        if (!user) {
            return res.status(404).json({ message: "Not found user" });
        }
        res.status(200).json(user);
    }).catch((err) => {
        console.error("Error retrieving user", err);
        res.status(500).json({ error: "Error retrieving user" });
    });
});

// endpoint de gui ket ban den user
app.post("/friend-request", async (req, res) => {
    const { currentUserId, selectedUserId } = req.body;

    try {

        await User.findByIdAndUpdate(selectedUserId, {
            $push: { friendRequests: currentUserId },
        });

        await User.findByIdAndUpdate(currentUserId, {
            $push: { sentFriendRequests: selectedUserId },
        });

        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
});

// endpoint de hien thi tat ca loi moi ket ban
app.get("/friend-request/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId).populate("friendRequests", "name email image").lean();

        const friendRequests = user.friendRequests;

        res.json(friendRequests);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//endpoint de chap nhan loi moi ket ban
app.post("/friend-request/accept", async (req, res) => {
    try {
        const { senderId, recepientId } = req.body;

        const sender = await User.findById(senderId);
        const recepient = await User.findById(recepientId);

        sender.friends.push(recepientId);
        recepient.friends.push(senderId);

        recepient.friendRequests = recepient.friendRequests.filter(
            (request) => request.toString() !== senderId.toString()
        );

        sender.sentFriendRequests = sender.sentFriendRequests.filter(
            (request) => request.toString() !== recepientId.toString()
        );

        await sender.save();
        await recepient.save();
        // console.log(sender);
        res.status(200).json({ message: "Friend Request accepted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }

});

//endpoint de hien thi ban da ket ban 
app.get("/accepted-friends/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate(
            "friends",
            "name email image"
        );

        const accepedtFriends = user.friends;
        res.json(accepedtFriends);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'files/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

//endpoint de gui tin nhan va luu vao backend
app.post("/messages", upload.single("imageFile"), async (req, res) => {
    try {
        const { senderId, recepientId, messageType, messageText } = req.body;

        const newMessage = new Message({
            senderId,
            recepientId,
            messageType,
            message: messageText,
            timeStamp: new Date(),
            imageUrl: messageType === "image" ? req.file.path : null,
        });

        await newMessage.save();
        res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//endpoint lay thong tin nguoi dung
app.get("/user/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const recepientId = await User.findById(userId);

        res.json(recepientId);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//endpoint de lay tin nhan trong chat room
app.get("/messages/:senderId/:recepientId", async (req, res) => {
    try {
        const { senderId, recepientId } = req.params;

        const messages = await Message.find({
            $or: [
                { senderId: senderId, recepientId: recepientId },
                { senderId: recepientId, recepientId: senderId },
            ],
        }).populate("senderId", "_id name");

        res.json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//
app.get("/friend-requests/sent/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate("sentFriendRequests", "name email image").lean();

        const sentFriendRequests = user.sentFriendRequests;
        // console.log(sentFriendRequests);
        res.json(sentFriendRequests);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/friends/:userId", (req, res) => {
    try {
        const { userId } = req.params;

        User.findById(userId).populate("friends").then((user) => {
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const friendIds = user.friends.map((friend) => friend._id);

            res.status(200).json(friendIds);
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//tao group chat
app.post("/create-group", async (req, res) => {
    try {
        const { name, members } = req.body;

        // const newGroup = new Group({ name, members });

        const newGroup = await new Group({ name, members }).save();

        for (const member of members) {
            await User.findByIdAndUpdate(member, { $push: { groups: newGroup._id } });
        }

        res.status(200).json({ message: "Group created successfully" });
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ error: "Error creating group" });
    }
});

//endpoint lay danh sach group chat
app.get("/group-chat/:userId", async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).populate(
            "groups",
            "name members"
        );
        // console.log("User: ", user);
        const groupChat = user.groups;
        // console.log("Group: ", groupChat);
        res.json(groupChat);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//endpoint lay thong tin group
app.get("/group-chat-detail/:groupId", async (req, res) => {
    try {
        const { groupId } = req.params;
        // console.log("groupId: ", groupId);
        const recepientId = await Group.findById(groupId);
        // console.log("recepientId", recepientId);
        res.json(recepientId);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//endpoint de gui tin nhan nhom va luu vao backend
app.post("/group-messages", upload.single("imageFile"), async (req, res) => {
    try {
        const { groupId, senderId, messageType, messageText } = req.body;

        const newMessage = new GroupMessage({
            groupId,
            senderId,
            messageType,
            message: messageText,
            timeStamp: new Date(),
            imageUrl: messageType === "image" ? req.file.path : null,
        });

        await newMessage.save();
        res.status(200).json({ message: "Message sent successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//endpoint de lay tin nhan trong chat group room
app.get("/group-messages/:groupId", async (req, res) => {
    try {
        const { groupId } = req.params;

        const messages = await GroupMessage.find({
            groupId: groupId
        });

        res.json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

//endpoint de xoa tin nhan
app.post("/deleteMessages", async(req, res) => {
    try {
        const {messages} = req.body;

        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ message: "Invalid req body" });
        }

        await Message.deleteMany({_id: {$in: messages}});
        res.json({message: "Messages deleted successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

//endpoint de xoa tin nhan nhom
app.post("/deleteMessagesGroup", async(req, res) => {
    try {
        const {messages} = req.body;

        if (!Array.isArray(messages) || messages.length === 0) {
            return res.status(400).json({ message: "Invalid req body" });
        }

        await GroupMessage.deleteMany({_id: {$in: messages}});
        res.json({message: "Messages deleted successfully"});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

//enpoint de thay doi password
app.post("/changePassword", async(req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
    
        // Check if user exists
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }
    
        // Update the user's password securely
        user.password = password;
        await user.save();
    
        res.json({ message: "Password changed successfully" });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      }
})