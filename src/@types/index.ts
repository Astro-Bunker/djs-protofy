import { Channel, ChannelType } from "discord.js";

export type GetChannelType<T extends ChannelType | keyof typeof ChannelType> =
  Extract<Channel, { type: T extends string ? (typeof ChannelType)[T] : T }>;

export type GuildChannelTypeString = Exclude<keyof typeof ChannelType, "DM" | "GroupDM">;
