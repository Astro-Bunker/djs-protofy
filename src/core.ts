import { Channels } from "./prototypes/channels";
import { GuildChannels } from "./prototypes/guildChannels";
import { GuildMembers } from "./prototypes/guildMembers";
import { Guilds } from "./prototypes/guilds";
import { Users } from "./prototypes/users";
import { verifyDJSVersion } from "./utils";

export class DJSEasier {
  constructor() {
    verifyDJSVersion();

    new Channels();
    new GuildChannels();
    new GuildMembers();
    new Guilds();
    new Users();
  }
}

