import { APIChannel, CategoryChannel, Channel, ChannelType, Client, DMChannel, DirectoryChannel, ForumChannel, Guild, MediaChannel, NewsChannel, PartialGroupDMChannel, StageChannel, TextChannel, ThreadChannel, VoiceChannel } from "discord.js";

export function createChannel(
  client: Client,
  data: APIChannel,
  guild?: Guild | null,
  { allowUnknownGuild }: { allowUnknownGuild?: boolean } = {},
): Channel {
  let channel;
  // @ts-expect-error ts(2339)
  if (!data.guild_id && !guild) {
    // @ts-expect-error ts(2339)
    if ((data.recipients && data.type !== ChannelType.GroupDM) || data.type === ChannelType.DM) {
      // @ts-expect-error ts(2673)
      channel = new DMChannel(client, data);
    } else if (data.type === ChannelType.GroupDM) {
      // @ts-expect-error ts(2673)
      channel = new PartialGroupDMChannel(client, data);
    }
  } else {
    // @ts-expect-error ts(2339)
    guild ??= client.guilds.cache.get(data.guild_id);

    if (guild || allowUnknownGuild) {
      switch (data.type) {
        case ChannelType.GuildText: {
          // @ts-expect-error ts(2673)
          channel = new TextChannel(guild, data, client);
          break;
        }
        case ChannelType.GuildVoice: {
          // @ts-expect-error ts(2554)
          channel = new VoiceChannel(guild, data, client);
          break;
        }
        case ChannelType.GuildCategory: {
          // @ts-expect-error ts(2345)
          channel = new CategoryChannel(guild, data, client);
          break;
        }
        case ChannelType.GuildAnnouncement: {
          // @ts-expect-error ts(2674)
          channel = new NewsChannel(guild, data, client);
          break;
        }
        case ChannelType.GuildStageVoice: {
          // @ts-expect-error ts(2554)
          channel = new StageChannel(guild, data, client);
          break;
        }
        case ChannelType.AnnouncementThread:
        case ChannelType.PublicThread:
        case ChannelType.PrivateThread: {
          // @ts-expect-error ts(2673)
          channel = new ThreadChannel(guild, data, client);
          if (!allowUnknownGuild) channel.parent?.threads.cache.set(channel.id, channel);
          break;
        }
        // @ts-expect-error ts(2678)
        case ChannelType.GuildDirectory:
          // @ts-expect-error ts(2345)
          channel = new DirectoryChannel(guild, data, client);
          break;
        case ChannelType.GuildForum:
          channel = new ForumChannel(guild, data, client);
          break;
        case ChannelType.GuildMedia:
          channel = new MediaChannel(guild, data, client);
          break;
      }
      if (channel && !allowUnknownGuild) guild?.channels?.cache.set(channel.id, channel);
    }
  }
  return channel;
}
