import { Router } from "express";
import passport from "passport";
import userModel from "../dao/mongo/models/users.js";
import { authToken } from "../middlewares/jwtAuth.js";
import { passportCall, generateToken } from "../services/auth.js";
import BaseRouter from "./router.js";

export default class SessionRouter extends BaseRouter {
  init() {

    this.post("/register",["NO_AUTH"], passportCall("register",{strategyType:"locals"}), (req, res) => {
      res.sendSuccess('successful registration');
    });

    this.post("/login",["NO_AUTH"], passportCall("login",{strategyType:"locals"}), (req, res) => {
      const token = generateToken(req.user);
      res.cookie("authToken", token, {
        maxAge: 1000 * 3600 * 6,
        httpOnly: true,
      }).sendSuccess('Logged In');
    });

  }
}

/* router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "registerFail",
    failureMessage: true,
  }),
  async (req, res) => {
    res.send({ status: "Succes", message: "Registered" });
  }
);

router.post("/login", passportCall("login"), async (req, res) => {
  const user = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  };

  const accesToken = generateToken(user);

  res
    .cookie("authToken", accesToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    })
    .send({ status: "succes", message: "Logged" });
});

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res.status(200).redirect("/login");
    } else {
      res.send({ status: "Logout error", body: err });
    }
  });
});

router.get("/github", passportCall("github"), (req, res) => {});

router.get("/githubCallback", passportCall("github"), (req, res) => {
  const user = {
    id: req.user.id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
  };
  const accesToken = generateToken(user);

  res
    .cookie("authToken", accesToken, {
      maxAge: 1000 * 60 * 60 * 24,
      httpOnly: true,
    })
    .send({ status: "succes", message: "Logged with GitHub" });
});

router.post("/restorePassword", async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .send({ status: "error", error: "User doesn't exist" });
  }
  const isSamePassword = await validatePassword(password, user.password);
  if (isSamePassword) {
    return res.status(400).send({
      status: "error",
      error: "cannot replace password with current password",
    });
  }

  const newHashedPassword = await createHash(password);
  await userModel.updateOne(
    { email },
    { $set: { password: newHashedPassword } }
  );
  res.sendStatus(200);
}); */
