import { CategoryChannel, Channel, ChannelType, Client, DMChannel, DirectoryChannel, ForumChannel, Guild, MediaChannel, Message, NewsChannel, PartialGroupDMChannel, StageChannel, TextChannel, ThreadChannel, User, VoiceChannel, type APIChannel, type APIGuild, type APIMessage, type APIUser } from "discord.js";
import { excludeNullishProperties, to_snake_case } from ".";

function createChannel(
  client: Client<true>,
  data: APIChannel,
  guild?: Guild,
  { allowUnknownGuild } = { allowUnknownGuild: true },
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
          // @ts-expect-error ts(2674)
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
          // @ts-expect-error ts(2345)
          channel = new ForumChannel(guild, data, client);
          break;
        case ChannelType.GuildMedia:
          // @ts-expect-error ts(2345)
          channel = new MediaChannel(guild, data, client);
          break;
      }
      if (channel && !allowUnknownGuild) guild?.channels?.cache.set(channel.id, channel);
    }
  }
  return channel;
}

export function createBroadcastedChannel(client: Client, data: Channel | APIChannel): Channel | undefined;
export function createBroadcastedChannel(client: Client, data: Record<string, any>) {
  if ("messages" in data) delete data.messages;
  if ("permissionOverwrites" in data) delete data.permissionOverwrites;
  if ("recipients" in data) delete data.recipients;
  // if ("threadMetadata" in data) delete data.threadMetadata;

  data = to_snake_case(data);

  // const clone = Object.assign(Object.create(data), data);
  const guild = client.guilds.cache.get(data.guild_id);

  if ("guild" in data && typeof data.guild === "string") {
    if (guild) {
      data.guild = guild;
    } else {
      delete data.guild;
    }
  }

  if ("member" in data && typeof data.member === "string") {
    if (guild) {
      data.member = guild.members.cache.get(data.member);
    } else {
      delete data.member;
    }
  }

  try {
    return createChannel(client as Client<true>, data as APIChannel, guild, { allowUnknownGuild: true });
  } catch (error: any) {
    client.emit("error", error);
  }
}

export function createBroadcastedGuild(client: Client, data: Guild | APIGuild): Guild | undefined;
export function createBroadcastedGuild(client: Client, data: Record<string, any>) {
  data = to_snake_case(data);

  const clone = Object.assign(Object.create(data), data);
  const guild = client.guilds.getById(data.id);

  if ("emojis" in data && Array.isArray(data.emojis)) {
    data.emojis = [];
    for (const id of clone.emojis) {
      const result = client.emojis.getById(id);
      if (result) data.emojis.push(result);
    }
  }

  if ("members" in data && Array.isArray(data.members)) {
    if (guild) {
      data.members = [];
      for (const id of clone.members) {
        const result = guild.members.getById(id);
        if (result) data.members.push(result);
      }
    } else {
      delete data.members;
    }
  }

  if ("roles" in data && Array.isArray(data.roles)) {
    if (guild) {
      data.roles = [];
      for (const id of clone.roles) {
        const result = guild.roles.getById(id);
        if (result) data.roles.push(result);
      }
    } else {
      delete data.roles;
    }
  }

  try {
    // @ts-expect-error ts(2673)
    return new Guild(client, data);
  } catch (error: any) {
    client.emit("error", error);
  }
}

export function createBroadcastedMessage(client: Client, data: Message | APIMessage): Message | undefined;
export function createBroadcastedMessage(client: Client, data: Record<string, any>) {
  if ("mentions" in data) delete data.mentions;
  excludeNullishProperties(data);

  data = to_snake_case(data);

  try {
    // @ts-expect-error ts(2673)
    return new Message(client, data);
  } catch (error: any) {
    client.emit("error", error);
  }
}

export function createBroadcastedUser(client: Client, data: User | APIUser): User | undefined;
export function createBroadcastedUser(client: Client, data: Record<string, any>) {
  data = to_snake_case(data);

  try {
    // @ts-expect-error ts(2674)
    return new User(client, data);
  } catch (error: any) {
    client.emit("error", error);
  }
}
