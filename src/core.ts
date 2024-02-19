import { AppCommand } from "./prototypes/applicationCommand";
import { ApplicationCommands } from "./prototypes/applicationCommands";
import { Channels } from "./prototypes/channels";
import { Emojis } from "./prototypes/emojis";
import { GuildChannels } from "./prototypes/guildChannels";
import { GuildEmojis } from "./prototypes/guildEmojis";
import { GMember } from "./prototypes/guildMember";
import { GuildMembers } from "./prototypes/guildMembers";
import { GuildMessages } from "./prototypes/guildMessages";
import { Guilds } from "./prototypes/guilds";
import { DjsMessage } from "./prototypes/message";
import { Messages } from "./prototypes/messages";
import { Roles } from "./prototypes/roles";
import { Users } from "./prototypes/users";
import { verifyDJSVersion } from "./utils";

export class DJSProtofy {
  constructor() {
    verifyDJSVersion();

    new AppCommand();
    new ApplicationCommands();
    new Channels();
    new Emojis();
    new GuildChannels();
    new GuildEmojis();
    new GMember();
    new GuildMembers();
    new GuildMessages();
    new Guilds();
    new DjsMessage();
    new Messages();
    new Roles();
    new Users();
  }
}

