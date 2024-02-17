import "discord.js";
import type { Channels } from "./src/prototypes/channels";
import { Emojis } from "./src/prototypes/emojis";
import { GuildEmojis } from "./src/prototypes/guildEmojis";
import type { GuildChannels } from "./src/prototypes/guildChannels";
import { GuildMembers } from "./src/prototypes/guildMembers";
import type { Guilds } from "./src/prototypes/guilds";
import { Users } from "./src/prototypes/users";
import { Roles } from "./src/prototypes/roles";
import { GuildMessages } from "./src/prototypes/guildMessages";
export * from "./src";

declare module "discord.js" {
  interface BaseGuildEmojiManager extends Emojis { }

  interface ChannelManager extends Channels { }
  
  interface GuildEmojiManager extends GuildEmojis { }

  interface GuildChannelManager extends GuildChannels { }

  interface GuildManager extends Guilds { }

  interface GuildMessageManager extends GuildMessages { }

  interface GuildMemberManager extends GuildMembers { }

  interface RoleManager extends Roles { }

  interface UserManager extends Users { }
}
