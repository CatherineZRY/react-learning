import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";

export const getUsersForSideBar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }) // 查询除了当前用户之外的所有用户
      .select('-password'); // 不要返回密码
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log('Error in getUsersForSideBar controller: ', error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getMessagesByUserId = async (req, res) => {
  const { userId: userToChatId } = req.params;
  const loggedInUserId = req.user._id;
  try {
    // 查询当前用户和目标用户之间的所有消息
    const messages = await Message.find({
      $or: [
        { senderId: loggedInUserId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: loggedInUserId },
      ],
    });
    // 更加时间顺序排序
    messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    res.status(200).json(messages);
  } catch (error) {
    console.log('Error in getMessagesByUserId controller: ', error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const sendMessageToUser = async (req, res) => {
  try {
    const { userId: userToChatId } = req.params;
    const { message, image } = req.body;
    const senderId = req.user._id;
    let imageUrl = null;
    if (image) {
      // 如果图片存在，则将图片上传到云存储
      const uploadedResponse = await cloudinary.uploader.upload(image, {
        folder: "messages",
        width: 500,
        height: 500,
        crop: "fill",
      });
      imageUrl = uploadedResponse.secure_url;
    }

    // 创建新消息
    const newMessage = new Message({
      senderId,
      receiverId: userToChatId,
      text: message,
      image: imageUrl,
    });
    await newMessage.save();

    // TODO: 实时消息发送，需要使用socket.io
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    console.log('Error in sendMessageToUser controller: ', error.message);
    res.status(500).json({ message: "Internal server error" });

  }
}
