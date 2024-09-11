import { setTimeout as sleep } from "timers/promises";
import { SApplicationCommand } from "./prototypes/applicationCommand";
import { ApplicationCommands } from "./prototypes/applicationCommands";
import { SArray } from "./prototypes/array";
import { CategoryChannelChildren } from "./prototypes/categoryChannelChildren";
import { Channels } from "./prototypes/channels";
import { SClient } from "./prototypes/client";
import { SCollection } from "./prototypes/collection";
import { SEmbed } from "./prototypes/embed";
import { Emojis } from "./prototypes/emojis";
import { GuildBans } from "./prototypes/guildBans";
import { GuildChannels } from "./prototypes/guildChannels";
import { GuildEmojis } from "./prototypes/guildEmojis";
import { SGuildMember } from "./prototypes/guildMember";
import { GuildMembers } from "./prototypes/guildMembers";
import { GuildMessages } from "./prototypes/guildMessages";
import { Guilds } from "./prototypes/guilds";
import { SMessage } from "./prototypes/message";
import { Messages } from "./prototypes/messages";
import { Roles } from "./prototypes/roles";
import { SShardClientUtil } from "./prototypes/shardClientUtil";
import { SString } from "./prototypes/string";
import { Users } from "./prototypes/users";
import { verifyDJSVersion } from "./utils";

export class DJSProtofy {
  constructor() {
    verifyDJSVersion();

    Object.assign(globalThis, {
      animated: true,
      disabled: true,
      ephemeral: true,
      fetchReply: true,
      inline: true,
      required: true,
      sleep,
    });

    new SArray();
    new SString();

    new SApplicationCommand();
    new ApplicationCommands();
    new CategoryChannelChildren();
    new Channels();
    new SClient();
    new SCollection();
    new SEmbed();
    new Emojis();
    new GuildBans();
    new GuildChannels();
    new GuildEmojis();
    new SGuildMember();
    new GuildMembers();
    new GuildMessages();
    new Guilds();
    new SMessage();
    new Messages();
    new Roles();
    new SShardClientUtil();
    new Users();
  }
}
