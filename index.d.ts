import "discord.js";
import type { Channels } from "./src/channels";
import { GuildChannels } from "./src/guildChannels";
export * from "./src";

declare module "discord.js" {
  interface ChannelManager {
    getById: Channels["getChannelById"];
    getByName: Channels["getChannelByName"];
    getByTopic: Channels["getChannelByTopic"];
    getByTypes: Channels["getChannelsByTypes"];
    getCategoryById: Channels["getCategoryById"];
    getCategoryByName: Channels["getCategoryByName"];
    getByUrl: Channels["getChannelByUrl"];
  }

  interface GuildChannelManager {
    getById: GuildChannels["getChannelById"];
    getByName: GuildChannels["getChannelByName"];
    getByTopic: GuildChannels["getChannelByTopic"];
    getByTypes: GuildChannels["getChannelsByTypes"];
    getCategoryById: GuildChannels["getCategoryById"];
    getCategoryByName: GuildChannels["getCategoryByName"];
    getByUrl: GuildChannels["getChannelByUrl"];
  }
}
