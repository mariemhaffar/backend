const User = require("../../models/User");
const FriendInvitation = require("../../models/FriendInvitation");
const serverStore = require("../../serverStore");

const updateFriendsPendingInvitations = async (userId) => {
  try {
    // find all active connections with userId
    const receiverList = serverStore.getActiveConnections(userId);

    if (receiverList.length > 0) {
      const pendingInvitations = await FriendInvitation.find({
        receiverId: userId,
      }).populate("senderId", "_id username mail");

      // get io server instance
      const io = serverStore.getSocketServerInstance();

      receiverList.forEach((receiverSocketId) => {
        io.to(receiverSocketId).emit("friends-invitations", {
          pendingInvitations: pendingInvitations ? pendingInvitations : [],
        });
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const updateFriends = async (userId) => {
  try {
    // find ative connections with specific id (online users)
    const receiverList = serverStore.getActiveConnections(userId);

    if (receiverList.length > 0) {
      const user = await User.findById(userId, { _id: 1, friends: 1 }).populate(
        "friends",
        "_id username mail"
      );

      if (user) {
        const friendsList = user.friends.map((f) => {
          return {
            id: f._id,
            mail: f.mail,
            username: f.username,
          };
        });

        // get io server instance
        const io = serverStore.getSocketServerInstance();

        receiverList.forEach((receiverSocketId) => {
          if (friendsList.length > 0) {
            io.to(receiverSocketId).emit("friends-list", {
              friends: friendsList,
            });
          }
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = { updateFriendsPendingInvitations, updateFriends };
