import { APIChannel, CategoryChannel, Channel, ChannelType, Client, DMChannel, DirectoryChannel, EnumLike, ForumChannel, Guild, MediaChannel, NewsChannel, PartialGroupDMChannel, StageChannel, TextChannel, ThreadChannel, VoiceChannel, version } from "discord.js";
import { suportedDJSVersion } from "./constants";

export function verifyDJSVersion() {
  const v = Number(version.split(".")[0]);

  if (v !== suportedDJSVersion) {
    console.warn(`Expected discord.js@${suportedDJSVersion}. Some features may not work correctly.`);
  }
}

export function resolveEnum<T extends EnumLike<any, unknown>>(enumLike: T, value: keyof T | T[keyof T]): T[keyof T] {
  if (typeof value === "string") return enumLike[value];
  return value as T[keyof T];
}

export async function createChannel(client: Client<true>, data: APIChannel, guild?: Guild): Promise<Channel> {
  if (!guild && "guild_id" in data) {
    guild = await client.guilds.getInShardsById(data.guild_id!)!;
  }

  switch (data.type) {
    case ChannelType.GuildText:
      // @ts-expect-error any
      return new TextChannel(client, data);
    case ChannelType.DM:
      // @ts-expect-error any
      return new DMChannel(client, data);
    case ChannelType.GuildVoice:
      return new VoiceChannel(guild!, data);
    case ChannelType.GroupDM:
      // @ts-expect-error any
      return new PartialGroupDMChannel(client, data);
    case ChannelType.GuildCategory:
      return new CategoryChannel(guild!, data, client);
    case ChannelType.GuildAnnouncement:
      // @ts-expect-error any
      return new NewsChannel(guild, data, client);
    case ChannelType.AnnouncementThread:
    case ChannelType.PublicThread:
    case ChannelType.PrivateThread:
      // @ts-expect-error any
      return new ThreadChannel(guild, data, client);
    case ChannelType.GuildStageVoice:
      return new StageChannel(guild!, data);
    // @ts-expect-error any
    case ChannelType.GuildDirectory:
      // @ts-expect-error any
      return new DirectoryChannel(client, data);
    case ChannelType.GuildForum:
      return new ForumChannel(guild, data, client);
    case ChannelType.GuildMedia:
      return new MediaChannel(guild, data, client);
    default:
      // @ts-expect-error any
      return new TextChannel(client, data);
  }
}
