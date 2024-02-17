import "discord.js";
import type { Channels } from "./src/prototypes/channels";
import type { GuildChannels } from "./src/prototypes/guildChannels";
import type { Guilds } from "./src/prototypes/guilds";
import type { Users } from "./src/prototypes/users";
import { GuildMembers } from "./src/prototypes/guildMembers";
export * from "./src";

declare module "discord.js" {
  interface ChannelManager {
    getById: Channels["getById"];
    getByName: Channels["getByName"];
    getByTopic: Channels["getByTopic"];
    getByTypes: Channels["getByTypes"];
    getByUrl: Channels["getByUrl"];
    getCategoryById: Channels["getCategoryById"];
    getCategoryByName: Channels["getCategoryByName"];
    getInShardsById: Channels["getInShardsById"];
    getInShardsByName: Channels["getInShardsByName"];
  }

  interface GuildChannelManager {
    getById: GuildChannels["getById"];
    getByName: GuildChannels["getByName"];
    getByTopic: GuildChannels["getByTopic"];
    getByTypes: GuildChannels["getByTypes"];
    getByUrl: GuildChannels["getByUrl"];
    getCategoryById: GuildChannels["getCategoryById"];
    getCategoryByName: GuildChannels["getCategoryByName"];
  }

  interface GuildManager {
    getById: Guilds["getById"];
    getByName: Guilds["getByName"];
    getByOwnerId: Guilds["getByOwnerId"];
    getInShardsById: Guilds["getInShardsById"];
    getInShardsByName: Guilds["getInShardsByName"];
    getInShardsByOwnerId: Guilds["getInShardsByOwnerId"];
  }

  interface GuildMemberManager {
    getById: GuildMembers["getById"];
    getByDisplayName: GuildMembers["getByDisplayName"];
    getByNickname: GuildMembers["getByNickname"];
    getByUserDisplayName: GuildMembers["getByUserDisplayName"];
    getByUserGlobalName: GuildMembers["getByUserGlobalName"];
    getByUserUsername: GuildMembers["getByUserUsername"];
  }

  interface UserManager {
    getById: Users["getById"];
    getByDisplayName: Users["getByDisplayName"];
    getByGlobalName: Users["getByGlobalName"];
    getByUsername: Users["getByUsername"];
    getInShardsById: Users["getInShardsById"];
    getInShardsByDisplayName: Users["getInShardsByDisplayName"];
    getInShardsByGlobalName: Users["getInShardsByGlobalName"];
    getInShardsByUsername: Users["getInShardsByUsername"];
  }
}
