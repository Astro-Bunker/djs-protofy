import "discord.js";
import type { AppCommand } from "./src/prototypes/applicationCommand";
import type { ApplicationCommands } from "./src/prototypes/applicationCommands";
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
import { DjsMessage } from "./src/prototypes/message";
export * from "./src";

declare module "discord.js" {

  interface ApplicationCommand extends AppCommand { }

  interface ApplicationCommandManager extends ApplicationCommands { }

  interface BaseGuildEmojiManager extends Emojis { }

  interface ChannelManager extends Channels { }

  interface GuildChannelManager extends GuildChannels { }

  interface GuildEmojiManager extends GuildEmojis { }

  interface GuildMember extends GMember { }

  interface GuildMemberManager extends GuildMembers { }

  interface GuildMessageManager extends GuildMessages { }

  interface GuildManager extends Guilds { }

  interface Message extends DjsMessage { }

  interface MessageManager extends Messages { }

  interface RoleManager extends Roles { }

  interface UserManager extends Users { }
}
