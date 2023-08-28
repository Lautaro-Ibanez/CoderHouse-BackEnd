import jwt from "jsonwebtoken";
import DTemplates from "../constants/DTemplates.js";
import {
  createHash,
  generateToken,
  validatePassword,
} from "../services/auth.js";
import { userService } from "../services/index.js";
import MailingService from "../services/mailingService.js";
import config from "../config/config.js";

const registerResponse = (req, res) => {
  res.sendSuccess("successful registration");
};

const login = (req, res) => {
  const token = generateToken(req.user);
  res
    .cookie("authToken", token, {
      maxAge: 1000 * 3600 * 6,
      httpOnly: true,
    })
    .sendSuccess("Logged In");
};

const getCurrentUser = (req, res) => {
  res.send({ status: "success", payload: req.user });
};

const logout = (req, res) => {
  res.clearCookie("authToken");
  res.redirect("/login");
};

const gitCreateUser = (req, res) => {
  const user = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    cart: req.user.cartId,
  };
  const accesToken = generateToken(user);

  res
    .cookie("authToken", accesToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    })
    .redirect("/products");
};

const restoreRequest = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.sendBadRequest("No email provided");
  const user = await userService.getUserBy({ email });
  if (!user) return res.sendNotFound("No user found with this email");
  const restoreToken = generateToken({ email: user.email }, "120s");
  const mailingService = new MailingService();
  const result = await mailingService.sendMail(
    user.email,
    DTemplates.RESTOREPASSWORD,
    { restoreToken }
  );
  res.sendSuccess("mail sent successfully");
};

const restorePassword = async (req, res) => {
  try {
    const { password, token } = req.body;
    const tokenEmail = jwt.verify(token, config.jwtSecret);
    const user = await userService.getUserBy({ email: tokenEmail.email });
    const isSamePassword = await validatePassword(password, user.password);
    console.log(isSamePassword);
    if (isSamePassword) return res.sendBadRequest("same password");
    const newHashedPassword = await createHash(password);
    console.log(newHashedPassword);
    await userService.updateUser(user._id, {
      password: newHashedPassword,
    });

    res.sendSuccess("password changed successfully");
  } catch (error) {console.log(error)}
};

export default {
  registerResponse,
  login,
  getCurrentUser,
  logout,
  gitCreateUser,
  restoreRequest,
  restorePassword,
};
