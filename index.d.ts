/* eslint-disable no-var */
import type { EnumLike } from "discord.js";
import { DiscordStringLimits } from "./src/@enum";
import type { SApplicationCommand } from "./src/prototypes/applicationCommand";
import type { ApplicationCommands } from "./src/prototypes/applicationCommands";
import type { Channels } from "./src/prototypes/channels";
import type { Emojis } from "./src/prototypes/emojis";
import type { GuildBans } from "./src/prototypes/guildBans";
import type { GuildChannels } from "./src/prototypes/guildChannels";
import type { GuildEmojis } from "./src/prototypes/guildEmojis";
import type { SGuildMember } from "./src/prototypes/guildMember";
import type { GuildMembers } from "./src/prototypes/guildMembers";
import type { GuildMessages } from "./src/prototypes/guildMessages";
import type { Guilds } from "./src/prototypes/guilds";
import type { SMessage } from "./src/prototypes/message";
import type { Messages } from "./src/prototypes/messages";
import type { Roles } from "./src/prototypes/roles";
import type { SShardClientUtil } from "./src/prototypes/shardClientUtil";
import type { Users } from "./src/prototypes/users";

export type * from "./src";

declare module "discord.js" {
  interface ApplicationCommand extends SApplicationCommand { }

  interface ApplicationCommandManager extends ApplicationCommands { }

  interface BaseGuildEmojiManager extends Emojis { }

  interface ChannelManager extends Channels { }

  interface GuildBanManager extends GuildBans { }

  interface GuildChannelManager extends GuildChannels { }

  interface GuildEmojiManager extends GuildEmojis { }

  interface GuildMember extends SGuildMember { }

  interface GuildMemberManager extends GuildMembers { }

  interface GuildMessageManager extends GuildMessages { }

  interface GuildManager extends Guilds { }

  interface Message extends SMessage { }

  interface MessageManager extends Messages { }

  interface RoleManager extends Roles { }

  interface ShardClientUtil extends SShardClientUtil { }

  interface UserManager extends Users { }

  interface Collection<K, V> {
    keysToArray(): K[]
    valuesToArray(): V[]
  }
}

declare global {
  var animated: true;
  var disabled: true;
  var ephemeral: true;
  var fetchReply: true;
  var inline: true;
  var required: true;

  interface String {
    limit<T extends typeof DiscordStringLimits>(size: keyof T | T[keyof T], enumLike?: T): string
    limit<T extends EnumLike>(size: keyof T | T[keyof T] | number, enumLike: T): string
    limit(size: number): string
  }
}
