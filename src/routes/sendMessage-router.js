import { Router } from "express";
import nodemailer from "nodemailer";
import config from "../config/config.js";
import __dirname from "../util.js";
import twilio from "twilio";

const router = Router();


const mailPassword = config.appMailPassword;
const mail = config.appMail;
const numberTwilio = config.twilioNumber;
const TWILIO_SID ="AC575868d4812c63eb6e4ebf1bc0da3e91";
const TWILIO_TOKEN ="2bad2f4cfbfd8a421f2702661f937261";


const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: mail,
    pass: mailPassword,
  },
});

router.get("/mail", async (req, res) => {
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

const twilioClient = twilio(TWILIO_SID,TWILIO_TOKEN);

router.get("/sms", async (req, res) => {
  const clientNumber = "+541122359444";
  const result = await twilioClient.messages.create({
    body: "mensage de prueba",
    from: numberTwilio,
    to: clientNumber,
  });
  res.send({ status: "success", payload: result });
});

export default router;
