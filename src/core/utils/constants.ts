import { readFileSync } from "fs";
import { join } from "path";

let packageJSON;
try { packageJSON = JSON.parse(readFileSync(join(__dirname, "..", "..", "package.json"), "utf8")); } catch { }

export const suportedDJSVersion = packageJSON
  ? Number(packageJSON.devDependencies["discord.js"].replace(/(^\D+)|(\D+.*$)/g, ""))
  : 0;
