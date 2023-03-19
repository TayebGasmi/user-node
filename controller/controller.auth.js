const { sendConfirmationEmail, sendRestEmail } = require("../utils/mail");
const Users = require("../models/model.user");
const Companies = require("../models/model.company");
const activationToken = require("../models/model.activationToken");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client();
const { AUTH_ROLES } = require("../middleware/auth");
const signUpExpert = async (req, res) => {
  const expertise = [];
  expertise.push(req.file.path);
  req.body.expertise = expertise;
  const document = await Users.findOne({ email: req.body.email })
    .select({ email: 1 })
    .lean()
    .exec();
  const other = await Companies.findOne({ email: req.body.email })
    .select({ email: 1 })
    .lean()
    .exec();
  if (document) {
    return res
      .status(400)
      .json({ error: { path: "email", msg: "email already registered" } });
  }
  if (other) {
    return res
      .status(400)
      .json({ error: { path: "email", msg: "email already registered" } });
  }
  console.log("hh");
  const newDocument = new Users({ ...req.body });
  const newCode = new activationToken({
    owner: newDocument._id,
    ref: Users.collection.name,
  });
  await Promise.all([newDocument.save(), newCode.save()]);
  sendConfirmationEmail(newDocument);
  console.log("hh");
  return res.status(200).json(newDocument);
};
const signInWithGoogle = async (req, res, next) => {
  const { idToken } = req.body;
  try {
    if (!idToken)
      throw new res.status(500).json({
        message: "Missing Google login infos!",
      });
    let response = await client.verifyIdToken({
      idToken,
    });
    const { email_verified, email } = response.payload;
    if (!email_verified)
      res.status(400).json({
        message: "Google account not verified!",
      });
    let user = await Users.findOne({ email })
      .select({
        email: 1,
        password: 1,
        isActive: 1,
        isBlocked: 1,
      })
      .populate("friends")
      .lean();
    if (user) {
      const token = jwt.sign(
        { _id: user._id, role: AUTH_ROLES.USER },
        process.env.JWT_SECRET,
        {
          expiresIn: "15d",
        }
      );
      return res.status(200).json({
        user,
        token,
      });
    } else {
      user = new Users({
        firstName: "FirstnameUser",
        lastName: "LastnameUser",
        email,
        password: email,
        birthDate: new Date(),
        country: "Country",
        gender: "male",
        isActive: true,
      });
      let googleUser = await user.save();
      const token = jwt.sign(
        { _id: googleUser._id, role: AUTH_ROLES.USER },
        process.env.JWT_SECRET,
        {
          expiresIn: "15d",
        }
      );
      return res.status(200).json({
        user,
        token,
      });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await Users.findOne({ email });
  const company = await Companies.findOne({ email });
  if (!user && !company) {
    return res.status(400).json({ error: "user not found" });
  }
  const document = user || company;
  const isMatch = await bcrypt.compare(password, document.password);
  if (!isMatch) {
    return res.status(400).json({ error: "invalid password" });
  }
  const token = jwt.sign(
    { email, role: document.role },
    process.env.JWT_SECRET,
    {
      expiresIn: "15d",
    }
  );
  if (!document.isActive) {
    return res.status(400).json({ error: "not active" });
  }
  if (document.isBlocked) {
    return res.status(400).json({ error: "blocked" });
  }
  const confirmationRole = [AUTH_ROLES.EXPERT, AUTH_ROLES.COMPANY];
  console.log(confirmationRole.includes(document.role));
  if (!document.isConfirmed && confirmationRole.includes(document.role)) {
    return res.status(400).json({ error: "not confirmed" });
  }
  return res.status(200).json({
    user,
    token,
  });
};
const confirmAccount = async (req, res) => {
  let ref = "";
  const user = await Users.findById(req.params.id);
  if (user) ref = "user";
  const company = await Companies.findById(req.params.id);
  if (company) ref = "company";
  const document = user || company;
  if (document.isActive) {
    await activationToken.deleteMany({ owner: req.params.id });
    return res.status(400).json({ error: "already active" });
  }
  const token = activationToken.findOne({ owner: req.params.id, ref }).lean();
  if (!token) {
    return res.status(400).json({ error: "error" });
  }
  document.isActive = true;
  await Promise.all([
    activationToken.deleteMany({
      owner: req.params.id,
      ref: Model.collection.name,
    }),
    document.save(),
  ]);
  return res.status(200).json("active");
};
const restPasswordMail = async (req, res) => {
  const email = req.params.email;
  let user = await Users.findOne({ email: req.params.email }).lean();
  const company = await Companies.findOne({ email }).lean();
  const document = user || company;
  if (!document) return res.status(400).json({ error: "!invalid email" });
  if (!document.isActive)
    return res.status(400).json({ error: "!inactive account" });
  if (document.isBlocked)
    return res.status(400).json({ error: "!blocked account" });
  sendRestEmail(req.params.email);
  return res.status(200).json("ok");
};
const restPasswordToken = () => async (req, res) => {
  const token = jwt.verify(req.params.token, process.env.JWT_SECRET);
  if (!token) {
    return res.status(400).json({ error: "invalid params" });
  }
  const email = req.params.email;
  const user = await Users.findOne({ email });
  const company = await Companies.findOne({ email });
  const document = user || company;
  if (!document) {
    return res.status(400).json({ error: "invalid email" });
  }
  document.password = req.body.password;
  await document.save();
  return res.status(200).json("password updated");
};

module.exports = {
  signUpExpert,
  signIn,
  confirmAccount,
  restPasswordMail,
  restPasswordToken,
  signInWithGoogle,
};
