import "discord.js";
import type { Channels } from "./src/channels";
import { GuildChannels } from "./src/guildChannels";
import { Guilds } from "./src/guilds";
import { Users } from "./src/users";
export * from "./src";

declare module "discord.js" {
  interface ChannelManager {
    getById: Channels["getById"];
    getByName: Channels["getByName"];
    getByTopic: Channels["getByTopic"];
    getByTypes: Channels["getByTypes"];
    getCategoryById: Channels["getCategoryById"];
    getCategoryByName: Channels["getCategoryByName"];
    getByUrl: Channels["getByUrl"];
    getInShardsById: Channels["getInShardsById"];
    getInShardsByName: Channels["getInShardsByName"];
  }

  interface GuildChannelManager {
    getById: GuildChannels["getById"];
    getByName: GuildChannels["getByName"];
    getByTopic: GuildChannels["getByTopic"];
    getByTypes: GuildChannels["getByTypes"];
    getCategoryById: GuildChannels["getCategoryById"];
    getCategoryByName: GuildChannels["getCategoryByName"];
    getByUrl: GuildChannels["getByUrl"];
  }

  interface GuildManager {
    getById: Guilds["getById"];
    getByName: Guilds["getByName"];
    getByOwnerId: Guilds["getByOwnerId"];
    getInShardsById: Guilds["getInShardsById"];
    getInShardsByName: Guilds["getInShardsByName"];
    getInShardsByOwnerId: Guilds["getInShardsByOwnerId"];
  }

  interface UserManager {
    getById: Users["getById"];
    getByUsername: Users["getByUsername"];
    getByGlobalName: Users["getByGlobalName"];
    getByDisplayName: Users["getByDisplayName"];
    getInShardsById: Users["getInShardsById"];
    getInShardsByUsername: Users["getInShardsByUsername"];
    getInShardsByGlobalName: Users["getInShardsByGlobalName"];
    getInShardsByDisplayName: Users["getInShardsByDisplayName"];
  }
}
