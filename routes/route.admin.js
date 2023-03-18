var express = require("express");
var router = express.Router();
const Users = require("../models/model.user");
const Companies = require("../models/model.company");
const { authorizeAdmin, AUTH_ROLES } = require("../middleware/auth");
const { COMPANY } = AUTH_ROLES;
const {
  verifyCompany,
  unverifyCompany,
  blockUser,
  unblockUser,
  getBlockedUser,
} = require("../controller/controller.admin");
const { verifyDoc } = require("../middleware/verfieDocument");
/* GET users listing. */
router.get("/blocked", authorizeAdmin, getBlockedUser);
router.put("/block/:id", authorizeAdmin, verifyDoc(Users), blockUser);
router.put("/unblock/:id", authorizeAdmin, verifyDoc(Users), unblockUser);
router.put(
  "/company/verify/:id/",
  authorizeAdmin,
  verifyDoc(Companies),
  verifyCompany
);
router.put(
  "/company/unverify/:id/",
  authorizeAdmin,
  verifyDoc(Companies),
  unverifyCompany
);
//display all users and companies
// admin confirm account for company and expert send email url login
// admin block user and company
// admin retrive blocked accounts
// admin view profile
module.exports = router;
