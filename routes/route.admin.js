var express = require("express");
var router = express.Router();
const Users = require("../models/model.user");
const Companies = require("../models/model.company");
const { authorizeAdmin, AUTH_ROLES } = require("../middleware/auth");
const { verifyDoc } = require("../middleware/verfieDocument");
const {
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
} = require("../controller/controller.admin");

router.get("/", authorizeAdmin, getUsers);
router.get("/companies", authorizeAdmin, getCompanies);

router.patch("/", verifyDoc(Users, "id"), blockUser);
router.patch("/company", verifyDoc(Companies, "id"), blockCompany);
router.patch("/confirm", verifyDoc(Users, "id"), confirmUser);
router.patch("/unconfirm", verifyDoc(Users, "id"), unConfirmUser);
router.patch("/company/confirm", verifyDoc(Companies, "id"), confirmCompany);
router.patch(
  "/company/unconfirm",
  verifyDoc(Companies, "id"),
  unConfirmCompany
);
router.patch("/unblock", verifyDoc(Users, "id"), unblockUser);
router.patch("/company/unblock", verifyDoc(Companies, "id"), unblockCompany);
module.exports = router;
