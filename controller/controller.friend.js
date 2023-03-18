const Users = require("../models/model.user");
const friendDetails = {
  firstName: 1,
  lastName: 1,
  picture: 1,
  coverPhoto: 1,
  field: 1,
  score: 1,
  country: 1,
};
const acceptInvitation = (friendId) => async (req, res) => {
  try {
    let fellasArray = [];
    const user = await Users.findById(req.user._id).exec();
    const index = user.friends.indexOf(req.params[friendId]);
    if (index !== -1) return res.status(400).json("already friends");
    const index2 = user.invitations.indexOf(req.params[friendId]);
    if (index2 === -1) return res.status(400).json("no invitation sent ");
    user.friends.push(req.params[friendId]);
    user.invitations.splice(index2, 1);
    const modifiedUser = await user.save();
    let newUserSchema = modifiedUser._doc;
    if(newUserSchema){
      const promises = newUserSchema.invitations.map(async fella => {
        const ami = await Users.findById(fella).select(friendDetails).lean().exec();
        fellasArray.push(ami);
      })
      await Promise.all(promises);
      newUserSchema = {...newUserSchema, invitations: fellasArray};
    }
    return res.status(200).json(newUserSchema);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const sendInvitation = (friendId) => async (req, res) => {
  try {
    const user = await Users.findById(req.params[friendId]);
    const index = user.friends.indexOf(req.user._id);
    if (index !== -1) return res.status(400).json("already friends");
    const index2 = user.invitations.indexOf(req.user._id);
    if (index2 !== -1) return res.status(400).json("invitation already sent ");
    user.invitations.push(req.user._id);
    await user.save();
    return res.status(200).json("invitation sent");
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const removeInvitation = (friendId) => async (req, res) => {
  try {
    let fellasArray = [];
    const user = await Users.findById(req.user._id);
    const index = user.invitations.indexOf(req.params[friendId]);
    if (index === -1) return res.status(400).json("invitation not sent yet ");
    user.invitations.splice(index, 1);
    let modifiedUser = await user.save();
    let newUserSchema = modifiedUser._doc;
    if(newUserSchema){
      const promises = newUserSchema.invitations.map(async fella => {
        const ami = await Users.findById(fella).select(friendDetails).lean().exec();
        fellasArray.push(ami);
      })
      await Promise.all(promises);
      newUserSchema = {...newUserSchema, invitations: fellasArray};
    }
    return res.status(200).json(newUserSchema);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const removeFriend = (friendId) => async (req, res) => {
  try {
    const user = await Users.findById(req.user._id);
    const index = user.friends.indexOf(req.params[friendId]);
    if (index === -1) return res.status(400).json("already not friends");
    user.friends.splice(index, 1);
    await user.save();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
const getFriends = async (req, res) => {
  try {
    const user = await Users.findById(req.user._id)
      .populate({
        path: "friends",
        select: friendDetails,
      })
      .lean()
      .exec();
    if (user.friends.length === 0) return res.status(204).json(user.friends);
    return res.status(200).json(user.friends);
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};
module.exports = {
  acceptInvitation,
  removeFriend,
  getFriends,
  sendInvitation,
  removeInvitation,
};
