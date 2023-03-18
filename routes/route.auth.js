const express = require("express");
const router = express.Router();
const validate = require("../middleware/schemaValidation");
const Users = require("../models/model.user");
const Companies = require("../models/model.company");
const {
  signIn,
  confirmAccount,
  restPasswordMail,
  restPasswordToken,
  signUp,
} = require("../controller/controller.auth");
const { companyValidator } = require("../validators/validators.company");
const { loginValidator } = require("../validators/validators.auth");
const { userValidator } = require("../validators/validators.user"); //user direct signIn expert and company wait for admin confirmation
router.post("/signIn", validate(loginValidator), signIn); //admin conf account for company and expert
router.post("/user", validate(userValidator), signUp(Users, Companies)); // + expert user isConfirmed = true by default + company expert isConfirmed = false by default
router.post("/company", validate(companyValidator), signUp(Companies, Users));
router.put("/confirm/:id", confirmAccount);
router.get("/restPasswordMail/:email", restPasswordMail);
router.put("/restPasswordToken/:token", restPasswordToken); //mail valid
//login with google
module.exports = router;
