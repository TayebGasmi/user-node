const express = require("express");
const router = express.Router();
const validate = require("../middleware/schemaValidation");
const {
  signIn,
  confirmAccount,
  restPasswordMail,
  restPasswordToken,
  signUpExpert,
} = require("../controller/controller.auth");
const { upload } = require("../utils/upload");
const { companyValidator } = require("../validators/validators.company");
const { loginValidator } = require("../validators/validators.auth");
const { userValidator } = require("../validators/validators.user"); //user direct signIn expert and company wait for admin confirmation
router.post("/signIn", validate(loginValidator), signIn); //admin conf account for company and expert
router.post("/expert", upload.single("expertise"), signUpExpert); // + expert user isConfirmed = true by default + company expert isConfirmed = false by default
router.post("/company", validate(companyValidator), signUpExpert);
router.put("/confirm/:id", confirmAccount);
router.get("/restPasswordMail/:email", restPasswordMail);
router.put("/restPasswordToken/:token", restPasswordToken); //mail valid
//login with google
module.exports = router;
