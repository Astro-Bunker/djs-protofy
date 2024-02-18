import { Channels } from "./prototypes/channels";
import { Emojis } from "./prototypes/emojis";
import { GuildChannels } from "./prototypes/guildChannels";
import { GuildEmojis } from "./prototypes/guildEmojis";
import { GuildMembers } from "./prototypes/guildMembers";
import { GuildMessages } from "./prototypes/guildMessages";
import { Guilds } from "./prototypes/guilds";
import { Messages } from "./prototypes/messages";
import { Roles } from "./prototypes/roles";
import { Users } from "./prototypes/users";
import { verifyDJSVersion } from "./utils";

export class DJSEasier {
  constructor() {
    verifyDJSVersion();

    new Channels();
    new Emojis();
    new GuildChannels();
    new GuildEmojis();
    new GuildMembers();
    new GuildMessages();
    new Guilds();
    new Messages();
    new Roles();
    new Users();
  }
}

