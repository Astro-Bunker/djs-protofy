import { readFileSync } from "fs";
import { join } from "path";

const packagePath = join(__dirname, "..", "..", "package.json");
const packageJSON = JSON.parse(readFileSync(packagePath, "utf8"));

export const suportedDJSVersion = Number(packageJSON.devDependencies["discord.js"].replace(/(^\D*)|(\D+.*$)/g, ""));
