const Users = require("../models/model.user");
const Companies = require("../models/model.company");
const { sendAffirmationEmail, sendBlockEmail } = require("../utils/mail");
const blockUser = async (req, res) => {
  console.log(req.body);
  try {
    const { id } = req.params;
    const blockedReason = req.body.blockedReason;
    const user = Users.findByIdAndUpdate(id, {
      isBlocked: true,
      blockedReason,
    });
    sendBlockEmail(user.email, req.body.blockedReason);
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
const unblockUser = async (req, res) => {
  const { id } = req.params;
  const user = Users.findByIdAndUpdate(id, { isBlocked: false });
  return res.status(200).json(user);
};
const blockCompany = async (req, res) => {
  const { id } = req.params;
  const company = Companies.findByIdAndUpdate(id, {
    isBlocked: true,
    blockedReason: req.body.blockedReason,
  });
  sendBlockEmail(user.email, req.body.blockedReason);
  return res.status(200).json(company);
};
const unblockCompany = async (req, res) => {
  const { id } = req.params;
  const company = Companies.findByIdAndUpdate(id, { isBlocked: false });
  return res.status(200).json(company);
};
const confirmUser = async (req, res) => {
  const { id } = req.params;
  const user = Users.findByIdAndUpdate(id, { isConfirmed: true });
  sendAffirmationEmail(user);
  return res.status(200).json(user);
};
const unConfirmUser = async (req, res) => {
  const { id } = req.params;
  const user = Users.findByIdAndUpdate(id, { isConfirmed: false });
  return res.status(200).json(user);
};
const confirmCompany = async (req, res) => {
  const { id } = req.params;
  const company = Companies.findByIdAndUpdate(id, { isConfirmed: true });
  sendAffirmationEmail(company);
  return res.status(200).json(company);
};
const unConfirmCompany = async (req, res) => {
  const { id } = req.params;
  const company = Companies.findByIdAndUpdate(id, { isConfirmed: false });
  return res.status(200).json(company);
};
const getUsers = async (req, res) => {
  const block = req.query.block;
  const confirm = req.query.confirm;
  const users = await Users.find({
    isBlocked: block || false,
    isConfirmed: confirm || false,
    isActive: true,
  });
  return res.status(200).json(users);
};
const getCompanies = async (req, res) => {
  const block = req.query.block;
  const confirm = req.query.confirm;
  const companies = await Companies.find({
    isBlocked: block,
    isConfirmed: confirm,
    isActive: true,
  });
  return res.status(200).json(companies);
};
module.exports = {
  blockUser,
  unblockUser,
  blockCompany,
  unblockCompany,
  confirmUser,
  unConfirmUser,
  confirmCompany,
  unConfirmCompany,
  getUsers,
  getCompanies,
};
