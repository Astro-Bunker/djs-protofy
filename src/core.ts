import { Client, version } from "discord.js";
import { Channels } from "./channels";
import { verifyDJSVersion } from "./utils";

export class DJSProto {
  constructor(protected client: Client) {
    verifyDJSVersion();

    new Channels(client);
  }
}

