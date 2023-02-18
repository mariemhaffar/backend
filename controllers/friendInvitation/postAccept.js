const FriendInvitation = require("../../models/FriendInvitation");
const User = require("../../models/User");
const friendsUpdates = require("../../socketHandlers/updates/friends");

const postAccept = async (req, res) => {
  try {
    const { id } = req.body;
    const invitation = await FriendInvitation.findById(id);

    if (!invitation) {
      return res
        .status(401)
        .send("Something went wrong!, invitation does not exist");
    }

    const { senderId, receiverId } = invitation;

    //    add friends to both users
    const senderUser = await User.findById(senderId);
    senderUser.friends = [...senderUser.friends, receiverId];

    const receiverUser = await User.findById(receiverId);
    receiverUser.friends = [...receiverUser.friends, senderId];

    await senderUser.save();
    await receiverUser.save();

    // Delete invitation from pending list
    await FriendInvitation.findByIdAndDelete(id);

    // update list of friends if users are online
    friendsUpdates.updateFriends(senderId.toString());
    friendsUpdates.updateFriends(receiverId.toString());

    // update list of friends pending invitations
    friendsUpdates.updateFriendsPendingInvitations(receiverId.toString());

    return res.status(200).send("Invitation Accepted !");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = postAccept;
