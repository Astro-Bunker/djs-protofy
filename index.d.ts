import "discord.js";
import type { AppCommand } from "./src/prototypes/apllicationCommand";
import type { Channels } from "./src/prototypes/channels";
import type { Emojis } from "./src/prototypes/emojis";
import type { GuildChannels } from "./src/prototypes/guildChannels";
import type { GuildEmojis } from "./src/prototypes/guildEmojis";
import type { GuildMembers } from "./src/prototypes/guildMembers";
import type { GuildMessages } from "./src/prototypes/guildMessages";
import type { Guilds } from "./src/prototypes/guilds";
import type { Messages } from "./src/prototypes/messages";
import type { Roles } from "./src/prototypes/roles";
import type { Users } from "./src/prototypes/users";
export * from "./src";

declare module "discord.js" {
  interface ApplicationCommand extends AppCommand { }

  interface BaseGuildEmojiManager extends Emojis { }

  interface ChannelManager extends Channels { }

  interface GuildChannelManager extends GuildChannels { }

  interface GuildEmojiManager extends GuildEmojis { }

  interface GuildMemberManager extends GuildMembers { }

  interface GuildMessageManager extends GuildMessages { }

  interface GuildManager extends Guilds { }

  interface MessageManager extends Messages { }

  interface RoleManager extends Roles { }

  interface UserManager extends Users { }
}
