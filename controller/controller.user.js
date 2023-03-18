const Users = require("../models/model.user");
const Companies = require("../models/model.company");
const updatePassword = async (req, res) => {
  const user = await Users.findById(req.user.id);
  const match = await user.matchPassword(req.body.password);
  if (!match) return res.status(400).json({ error: "wrong password" });
  user.password = req.body.newPassword;
  await user.save();
  return res.status(200).json("password updated");
};
const updateProfile = async (req, res) => {
  const { id, role, email } = req;
  if ((role == "USER" || role == "EXPERT") && email == req.body.email) {
    await Users.findByIdAndUpdate(id, req.body);
    return res.status(200).json("profile updated");
  }
  if (role == "COMPANY" && email == req.body.email) {
    await Companies.findByIdAndUpdate(id, req.body);
    return res.status(200).json("profile updated");
  }
};
module.exports = {
  updatePassword,
  updateProfile,
};
