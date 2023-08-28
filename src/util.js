import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";
import Handlebars from "handlebars";

export const generateMailTemplate = async (template, payload) => {
  const content = await fs.promises.readFile(
    `${__dirname}/templates/${template}.handlebars`,
    "utf-8"
  );
  const preCompiledContent = Handlebars.compile(content);
  const compiledContent = preCompiledContent({ ...payload });
  return compiledContent;
};

//------------------------------- COOKIE -------------------------------//

export const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["authToken"];
  }
  return token;
};

//------------------------------- dirname -------------------------------//

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;
