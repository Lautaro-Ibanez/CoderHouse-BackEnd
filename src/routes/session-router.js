import { Router } from "express";
import usersModel from "../dao/mongo/models/users.js";
import { createHash, validatePassword } from "../util.js";
const router = Router();

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const exists = await usersModel.findOne({ email });
  if (exists)
    return res
      .status(400)
      .send({ status: "error", error: "User already exists" });

  const hashedPassword = await createHash(password);

  const user = {
    name,
    email,
    password: hashedPassword,
  };

  const result = await usersModel.create(user);

  res.send({ status: "Succes", payloads: result });
});

router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    req.session.user = {
      name: "admin",
      email: "adminCoder@coder.com",
      role: "Admin",
    };
    return res.send({ status: "succes", message: "logged on" });
  }

  const user = await usersModel.findOne({ email });
  if (!user) {
    return res
      .status(400)
      .send({ status: "error", error: "Incorrect user or password" });
  }

  const isValidPassword = validatePassword(password, user.password);
  if (!isValidPassword)
    return res.status(400).send({ status: "error", error: "Invalid Password" });

  req.session.user = {
    name: user.name,
    email: user.email,
    role: user.role,
  };

  res.send({ status: "succes", message: "logged on" });
});

router.get("/logout", async (req, res) => {
  req.session.destroy((err) => {
    if (!err) {
      res
        .status(200)
        .redirect("/login")
    } else {
      res.send({ status: "Logout error", body: err });
    }
  });
});

export default router;
