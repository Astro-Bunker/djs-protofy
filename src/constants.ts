import { readFileSync } from "fs";
import { join } from "path";

const packagePath = join(__dirname, "..", "package.json");

export const suportedDJSVersion = Number(JSON.parse(readFileSync(packagePath, "utf8"))
  .devDependencies["discord.js"].replace(/(^\D*)|(\D+.*$)/g, ""));
