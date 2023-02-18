const Conversation = require("../models/Conversation");
const Message = require("../models/Message");
const chatUpdates = require("./updates/chat");

const directMessageHandler = async (socket, data) => {
  try {
    const { userId } = socket.user;
    const { receiverUserId, content } = data;

    // create new message
    const message = await Message.create({
      author: userId,
      content,
      date: new Date(),
      type: "DIRECT",
    });

    // find if conversation exist with two users
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverUserId] },
    });

    if (conversation) {
      conversation.messages.push(message._id);
      await conversation.save();

      // perform update to sender and receiver if there online
      chatUpdates.updateChatHistory(conversation._id.toString());
    } else {
      // create new conversation
      const newConversation = await Conversation.create({
        messages: [message._id],
        participants: [userId, receiverUserId],
      });

      // perform update to sender and receiver if there online
      chatUpdates.updateChatHistory(newConversation._id.toString());
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = directMessageHandler;
