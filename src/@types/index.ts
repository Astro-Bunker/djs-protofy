import { type APIChannelSelectComponent, type APIRoleSelectComponent, type APISelectMenuComponent, type APISelectMenuDefaultValue, type APIUserSelectComponent, type Channel, type ChannelType, type EnumLike, type GuildBasedChannel, type GuildChannelType, type SelectMenuDefaultValueType } from "discord.js";

export type EnumResolvable<E extends EnumLike<keyof E, unknown> = any, K extends keyof E = keyof E> = K | E[K];

export type ChannelTypeString = keyof typeof ChannelType;

export type GuildChannelTypeString = Exclude<ChannelTypeString, "DM" | "GroupDM">;

export type ChannelWithType<T extends ChannelType | ChannelTypeString> =
  Extract<Channel, { type: T extends string ? (typeof ChannelType)[T] : T }>;

export type GuildChannelWithType<T extends GuildChannelType | GuildChannelTypeString> =
  Extract<GuildBasedChannel, { type: T extends string ? (typeof ChannelType)[T] : T }>;

export interface AwaitOptions {
  time?: number;
}

export type SelectMenuDefaultValueTypeBySelectType<T extends APISelectMenuComponent> =
  T extends APIChannelSelectComponent
  ? SelectMenuDefaultValueType.Channel
  : T extends APIRoleSelectComponent
  ? SelectMenuDefaultValueType.Role
  : T extends APIUserSelectComponent
  ? SelectMenuDefaultValueType.User
  : SelectMenuDefaultValueType;

export type APISelectMenuComponentWithDefaultValue<D extends SelectMenuDefaultValueType = SelectMenuDefaultValueType> =
  Extract<APISelectMenuComponent, { default_values?: APISelectMenuDefaultValue<D>[] }>
