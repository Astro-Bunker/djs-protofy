import { APIChannel, APIGuild, APIMessage, APIUser, Channel, Client, Guild, Message, User } from "discord.js";
import { excludeNullishProperties, to_snake_case } from ".";
// @ts-expect-error ts(7016)
import { createChannel } from "discord.js/src/util/Channels";

export function createBroadcastedChannel(client: Client, data: Channel | APIChannel): Channel | undefined;
export function createBroadcastedChannel(client: Client, data: Record<string, any>) {
  if ("messages" in data) delete data.messages;
  if ("permissionOverwrites" in data) delete data.permissionOverwrites;
  if ("recipients" in data) delete data.recipients;
  // if ("threadMetadata" in data) delete data.threadMetadata;

  data = to_snake_case(data);

  // const clone = Object.assign(Object.create(data), data);
  const guild = client.guilds.getById(data.guild_id);

  if ("guild" in data && typeof data.guild === "string") {
    if (guild) {
      data.guild = guild;
    } else {
      delete data.guild;
    }
  }

  if ("member" in data && typeof data.member === "string") {
    if (guild) {
      data.member = guild.members.getById(data.member);
    } else {
      delete data.member;
    }
  }

  try {
    return createChannel(client, data, guild, { allowUnknownGuild: true });
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
