import "discord.js";
import type { Channels } from "./src/prototypes/channels";
import { Emojis } from "./src/prototypes/emojis";
import type { GuildChannels } from "./src/prototypes/guildChannels";
import { GuildMembers } from "./src/prototypes/guildMembers";
import type { Guilds } from "./src/prototypes/guilds";
import { Users } from "./src/prototypes/users";
export * from "./src";

declare module "discord.js" {
  interface BaseGuildEmojiManager extends Emojis { }

  interface ChannelManager extends Channels { }

  interface GuildChannelManager extends GuildChannels { }

  interface GuildManager extends Guilds { }

  interface GuildMemberManager extends GuildMembers { }

  interface UserManager extends Users { }
}
