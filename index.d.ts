import "discord.js";
import type { SApplicationCommand } from "./src/prototypes/applicationCommand";
import type { ApplicationCommands } from "./src/prototypes/applicationCommands";
import type { Channels } from "./src/prototypes/channels";
import type { Emojis } from "./src/prototypes/emojis";
import type { GuildChannels } from "./src/prototypes/guildChannels";
import type { GuildEmojis } from "./src/prototypes/guildEmojis";
import type { SGuildMember } from "./src/prototypes/guildMember";
import type { GuildMembers } from "./src/prototypes/guildMembers";
import type { GuildMessages } from "./src/prototypes/guildMessages";
import type { Guilds } from "./src/prototypes/guilds";
import type { SMessage } from "./src/prototypes/message";
import type { Messages } from "./src/prototypes/messages";
import type { Roles } from "./src/prototypes/roles";
import type { Users } from "./src/prototypes/users";

declare module "discord.js" {
  interface ApplicationCommand extends SApplicationCommand { }

  interface ApplicationCommandManager extends ApplicationCommands { }

  interface BaseGuildEmojiManager extends Emojis { }

  interface ChannelManager extends Channels { }

  interface GuildChannelManager extends GuildChannels { }

  interface GuildEmojiManager extends GuildEmojis { }

  interface GuildMember extends SGuildMember { }

  interface GuildMemberManager extends GuildMembers { }

  interface GuildMessageManager extends GuildMessages { }

  interface GuildManager extends Guilds { }

  interface Message extends SMessage { }

  interface MessageManager extends Messages { }

  interface RoleManager extends Roles { }

  interface UserManager extends Users { }

  interface Collection<K, V> {
    keysToArray(): K[]
    valuesToArray(): V[]
  }
}
