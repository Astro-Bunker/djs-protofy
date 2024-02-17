import { readFileSync } from "fs";

export const suportedDJSVersion = Number(JSON.parse(readFileSync("../package.json", "utf8"))
  .devDependencies["discord.js"].replace(/(^\D*)|(\D+.*$)/g, ""));
