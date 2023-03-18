const express = require("express");
const router = express.Router();
const validate = require("../middleware/schemaValidation");

const { authorize, AUTH_ROLES } = require("../middleware/auth");
const { USER } = AUTH_ROLES;
const { upload } = require("../utils/upload");
const {
  updatePassword,
  updateProfile,
} = require("../controller/controller.user");
const { userProfile } = require("../validators/validators.user");
const { changePassword } = require("../validators/validators.changePassword");
router.put("/", authorize([USER]), validate(userProfile), updateProfile);
router.put(
  "/password",
  authorize([USER]),
  validate(changePassword),
  updatePassword
);
router.post("/upload", upload.single("file"), (req, res) => {
  res.status(200).json({ file: req.file });
});
//update profile
//experience popup
//logout
//private route admin and user
//upload file
module.exports = router;
