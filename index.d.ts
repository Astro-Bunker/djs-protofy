import "discord.js";
import type { Channels } from "./src/channels";
import { GuildChannels } from "./src/guildChannels";
import { Guilds } from "./src/guilds";
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
  }
}
