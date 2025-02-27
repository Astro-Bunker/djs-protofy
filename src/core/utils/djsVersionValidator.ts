import { version } from "discord.js";
import { targetDJSVersion } from "./constants";

export function verifyDJSVersion() {
  if (!isNaN(targetDJSVersion) && targetDJSVersion !== Number(version.split(".")[0])) {
    process.emitWarning(`Expected discord.js@${targetDJSVersion}. Some features may not work correctly.`);
  }
}
