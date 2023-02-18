const FriendInvitation = require("../../models/FriendInvitation");
const friendsUpdates = require("../../socketHandlers/updates/friends");

const postReject = async (req, res) => {
  try {
    const { id } = req.body;
    const { userId } = req.user;

    // remove that invitaton from invitations collection
    const inviationExists = await FriendInvitation.exists({ _id: id });

    if (inviationExists) {
      await FriendInvitation.findByIdAndDelete(id);
    }

    // update pending invitations
    friendsUpdates.updateFriendsPendingInvitations(userId);

    return res.status(200).send("Invitation Rejected !");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

module.exports = postReject;
