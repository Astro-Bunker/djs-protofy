import { Channels } from "./channels";
import { GuildChannels } from "./guildChannels";
import { Guilds } from "./guilds";
import { verifyDJSVersion } from "./utils";

export class DJSProto {
  constructor() {
    verifyDJSVersion();

    new Channels();
    new GuildChannels();
    new Guilds();
  }
}

