import "discord.js";
import type { Channels } from "./src/channels";
export * from "./src";

declare module "discord.js" {
  interface ChannelManager {
    getById: Channels["getChannelById"];
    getByName: Channels["getChannelByName"];
    getByTopic: Channels["getChannelByTopic"];
    getByTypes: Channels["getChannelsByTypes"];
    getCategoryById: Channels["getCategoryById"];
    getCategoryByName: Channels["getCategoryByName"];
  }
}
