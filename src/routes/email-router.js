import { Router } from "express";
import nodemailer from "nodemailer";
import config from "../config/config.js";
import __dirname from "../util.js";

const router = Router();

const APP_MAIL_PASSWORD = config.appMailPassword;
const APP_MAIL = config.appMail;

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: APP_MAIL,
    pass: APP_MAIL_PASSWORD,
  },
});

router.get("/", async (req, res) => {
  const result = await transport.sendMail({
    from: "Lauti <mombusssss@gmail.com>",
    to: "lautaro.ibanez.1995@gmail.com",
    subject: "test mail",
    html: `
    <div>
    <h1>Correo de prueba</h1>
    </div>
    `,
    attachments: [],
  });
  res.send({ status: "success", payload: result });
});

export default router;
