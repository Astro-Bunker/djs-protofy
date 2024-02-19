import { Channel, ChannelType, GuildChannelType } from "discord.js";

export type ChannelTypeString = keyof typeof ChannelType;

export type GuildChannelTypeString = Exclude<keyof typeof ChannelType, "DM" | "GroupDM">;

export type ChannelWithType<T extends ChannelType | ChannelTypeString> =
  Extract<Channel, { type: T extends string ? (typeof ChannelType)[T] : T }>;

export type GuildChannelWithType<T extends GuildChannelType | GuildChannelTypeString> =
  Extract<Channel, { type: T extends string ? (typeof ChannelType)[T] : T }>;
