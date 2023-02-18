const FriendInvitation = require("../../models/FriendInvitation");
const User = require("../../models/User");
const friendsUpdate = require("../../socketHandlers/updates/friends");

const postInvite = async (req, res) => {
  const { targetMailAddress } = req.body;
  const { userId, mail } = req.user;

  // check if invited friend <> of current user
  if (mail.toLowerCase() === targetMailAddress.toLowerCase()) {
    return res.status(409).send("Sorry dear!, cannot invite yourself");
  }

  const targetUser = await User.findOne({
    mail: targetMailAddress.toLowerCase(),
  });

  if (!targetUser) {
    return res.status(404).send(`Friend ${targetMailAddress} not found !`);
  }

  // Check if inv already sent
  const invitationAlreadyReceived = await FriendInvitation.findOne({
    senderId: userId,
    receiverId: targetUser._id,
  });

  if (invitationAlreadyReceived) {
    return res.status(409).send("Already invited this friend !");
  }

  // check if user is aready a friend
  const usersAlreadyFriends = targetUser.friends.find(
    (friendId) => friendId.toString() === userId.toString()
  );

  if (usersAlreadyFriends) {
    return res.status(409).send("Already friends !");
  }

  // Create and save new invitation
  await FriendInvitation.create({
    senderId: userId,
    receiverId: targetUser._id,
  });

  // if invitation create => inform the user that invitation created

  // send pending invitations update to specified user
  friendsUpdate.updateFriendsPendingInvitations(targetUser._id.toString());
  return res.status(201).send("Invitation has been sent !");
};

module.exports = postInvite;
