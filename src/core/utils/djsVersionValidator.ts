import { version } from "discord.js";
import { suportedDJSVersion } from "./constants";

export function verifyDJSVersion() {
  const v = Number(version.split(".")[0]);

  if (v > suportedDJSVersion) {
    process.emitWarning(`Expected discord.js@${suportedDJSVersion}. Some features may not work correctly.`);
  }
}
