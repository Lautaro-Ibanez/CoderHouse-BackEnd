import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  const user = {
    name: "Lautaro",
    email: "Mombusssss@gmail.com",
  };
  res.render("home", {
    name: user.name,
    css: "home",
  });
});

router.get("/realTimeProducts", (req, res) => {
  res.render("realTimeProducts", {
    css: "realTimeProducts",
  });
});

export default router;
