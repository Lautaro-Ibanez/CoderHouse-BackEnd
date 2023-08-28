import dotenv from "dotenv";
import { Command } from "commander";

const program = new Command();
program.option("-m, --mode <mode>", "Modo de ejecucion", "prod");
program.parse(process.argv);

dotenv.config({
  path:
    program.opts().mode === "dev"
      ? ".env.development"
      : ".env.production",
});

export default {
  port: process.env.PORT,
  persistence: process.env.PERSISTENCE,
  mongoURL: process.env.MONGO_URL,
  adminEmail: process.env.ADMIN_EMAIL,
  adminPassword: process.env.ADMIN_PASSWORD,
  jwtSecret: process.env.JWT_SECRET,
  gitHubClientSecret: process.env.GITHUB_CLIENT_SECRET,
  githubClientId: process.env.GITHUB_CLIENT_ID,
  appMailPassword: process.env.APP_MAIL_PASSWORD,
  appMail: process.env.APP_MAIL,
  twilioNumber: process.env.TWILIO_NUMBER,
  twilioSid: process.env.TWILIO_SID,
  twilioToken: process.env.TWILIO_TOKEN,
  loggerEnv: process.env.LOGGER_ENV
};
