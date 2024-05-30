/* eslint-disable no-var */
import type { EnumLike } from "discord.js";
import type { setTimeout } from "timers/promises";
import type { DiscordStringLimits } from "./src/@enum";
import type { SApplicationCommand } from "./src/prototypes/applicationCommand";
import type { ApplicationCommands } from "./src/prototypes/applicationCommands";
import type { SArray } from "./src/prototypes/array";
import type { Channels } from "./src/prototypes/channels";
import type { SCollection } from "./src/prototypes/collection";
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
import type { SString } from "./src/prototypes/string";
import type { Users } from "./src/prototypes/users";

export * from "./src";

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

  interface Collection<K, V> extends SCollection<K, V> { }
}

declare global {
  /** @DJSProtofy */
  var animated: true;
  /** @DJSProtofy */
  var disabled: true;
  /** @DJSProtofy */
  var ephemeral: true;
  /** @DJSProtofy */
  var fetchReply: true;
  /** @DJSProtofy */
  var inline: true;
  /** @DJSProtofy */
  var required: true;

  /** @DJSProtofy */
  declare function sleep<T = void>(...args: Parameters<typeof setTimeout<T>>): ReturnType<typeof setTimeout<T>>;

  interface Array<T> extends SArray<T> {
    random(): ?T
    random(amount: never): null;
    random(amount: number): T[]
    random(amount: number, allowDuplicates: boolean): T[]
  }

  interface String extends SString {
    limit<T extends typeof DiscordStringLimits>(size: keyof T | T[keyof T], enumLike?: T): string
    limit<T extends EnumLike>(size: keyof T | T[keyof T] | number, enumLike: T): string
    limit(size: number): string
  }
}
