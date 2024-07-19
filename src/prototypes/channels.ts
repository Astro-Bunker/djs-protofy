import { ChannelManager, ChannelType, Collection, type APIChannel, type CategoryChannel, type Channel, type ChannelResolvable, type Message, type MessageCreateOptions, type MessagePayload, type VoiceBasedChannel } from "discord.js";
import { isRegExp } from "util/types";
import type { ChannelTypeString, ChannelWithType } from "../@types";
import { compareStrings, exists, replaceMentionCharacters, resolveEnum, serializeRegExp, to_snake_case } from "../utils";
import { createBroadcastedChannel, createBroadcastedMessage } from "../utils/shardUtils";

export class Channels {
  declare cache: ChannelManager["cache"];
  declare client: ChannelManager["client"];
  declare fetch: ChannelManager["fetch"];
  declare resolve: ChannelManager["resolve"];
  declare resolveId: ChannelManager["resolveId"];

  constructor() {
    Object.defineProperties(ChannelManager.prototype, {
      getById: { value: this.getById },
      getByName: { value: this.getByName },
      getByTopic: { value: this.getByTopic },
      getByUrl: { value: this.getByUrl },
      getCategoryById: { value: this.getCategoryById },
      getCategoryByName: { value: this.getCategoryByName },
      getInShardsById: { value: this.getInShardsById },
      getInShardsByName: { value: this.getInShardsByName },
      getVoiceByUserId: { value: this.getVoiceByUserId },
      filterByTypes: { value: this.filterByTypes },
      send: { value: this.send },
      searchBy: { value: this.searchBy },
      _searchByMany: { value: this._searchByMany },
      _searchByRegExp: { value: this._searchByRegExp },
      _searchByString: { value: this._searchByString },
    });
  }

  /** @DJSProtofy */
  getById(id: string): Channel | undefined;
  getById<T extends ChannelType | ChannelTypeString>(id: string, type: T): ChannelWithType<T> | undefined;
  getById(id: string, type?: ChannelType | ChannelTypeString) {
    const channel = this.cache.get(id);
    if (!exists(type)) return channel;
    if (channel?.type === resolveEnum(ChannelType, type)) return channel;
  }

  /** @DJSProtofy */
  getByName(name: string | RegExp): Channel | undefined;
  getByName<T extends ChannelType | ChannelTypeString>(name: string | RegExp, type: T): ChannelWithType<T> | undefined;
  getByName(name: string | RegExp, type?: ChannelType | ChannelTypeString) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    if (exists(type)) type = resolveEnum(ChannelType, type);

    return this.cache.find(channel => {
      if (exists(type) && channel.type !== type) return false;

      if ("name" in channel && channel.name) {
        if (typeof name === "string") {
          return compareStrings(channel.name, name);
        }

        return name.test(channel.name);
      }
    });
  }

  /** @DJSProtofy */
  getByTopic(topic: string | RegExp): Channel | undefined;
  getByTopic<T extends ChannelType | ChannelTypeString>(topic: string | RegExp, type: T): ChannelWithType<T> | undefined;
  getByTopic(topic: string | RegExp, type?: ChannelType | ChannelTypeString) {
    if (typeof topic !== "string" && !isRegExp(topic)) return;

    if (exists(type)) type = resolveEnum(ChannelType, type);

    return this.cache.find(channel => {
      if (exists(type) && channel.type !== type) return false;

      if ("topic" in channel && channel.topic) {
        if (typeof topic === "string")
          return compareStrings(channel.topic, topic);

        return topic.test(channel.topic);
      }
    });
  }

  /** @DJSProtofy */
  getByUrl(url: string | URL): Channel | undefined;
  getByUrl<T extends ChannelType | ChannelTypeString>(url: string | URL, type: T): ChannelWithType<T> | undefined;
  getByUrl(url: string | URL, type?: ChannelType | ChannelTypeString) {
    url = url.toString();

    if (exists(type)) type = resolveEnum(ChannelType, type);

    return this.cache.find(channel => channel.url === url && (exists(type) ? channel.type === type : true));
  }

  /** @DJSProtofy */
  getCategoryById(id: string) {
    const category = this.cache.get(id);
    if (category?.type !== ChannelType.GuildCategory) return;
    return category;
  }

  /** @DJSProtofy */
  getCategoryByName(name: string | RegExp): CategoryChannel | undefined {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(channel => {
      if (channel.type !== ChannelType.GuildCategory) return false;

      if (typeof name === "string") {
        return compareStrings(channel.name, name);
      }

      return name.test(channel.name);
    }) as CategoryChannel;
  }

  /** @DJSProtofy */
  getInShardsById(id: string): Promise<Channel | null>;
  getInShardsById(id: string, allowApiChannel: true): Promise<APIChannel | Channel | null>;
  async getInShardsById(id: string, allowApiChannel?: boolean) {
    if (typeof id !== "string") return null;

    const existing = this.getById(id);
    if (existing) return existing;

    if (!this.client.shard) return null;

    return await this.client.shard.broadcastEval((shard, id) => shard.channels.getById(id), { context: id })
      .then(res => res.find(Boolean) as any)
      .then(data => data ? createBroadcastedChannel(this.client, data)
        ?? (allowApiChannel ? to_snake_case(data) : null) : null)
      .catch(() => null);
  }

  /** @DJSProtofy */
  getInShardsByName(name: string | RegExp): Promise<Channel | null>;
  getInShardsByName(name: string | RegExp, allowApiChannel: true): Promise<APIChannel | Channel | null>;
  async getInShardsByName(name: string | RegExp, allowApiChannel?: boolean) {
    if (typeof name !== "string" && !isRegExp(name)) return null;

    const existing = this.getByName(name);
    if (existing) return existing;

    if (!this.client.shard) return null;

    const context = serializeRegExp(name);

    return await this.client.shard.broadcastEval((shard, { flags, isRegExp, source }) =>
      shard.channels.getByName(isRegExp ? RegExp(source, flags) : source), { context })
      .then(res => res.find(Boolean) as any)
      .then(data => data ? createBroadcastedChannel(this.client, data)
        ?? (allowApiChannel ? to_snake_case(data) : null) : null)
      .catch(() => null);
  }

  /** @DJSProtofy */
  getVoiceByUserId(id: string): VoiceBasedChannel | undefined {
    if (typeof id !== "string") return;

    return this.cache.find((channel) => {
      if (!channel.isVoiceBased()) return false;

      return channel.members.has(id);
    }) as VoiceBasedChannel;
  }

  /** @DJSProtofy */
  filterByTypes<T extends ChannelType | ChannelTypeString>(type: T | T[]): Collection<string, ChannelWithType<T>>;
  filterByTypes<T extends ChannelType | ChannelTypeString>(type: T | T[]) {
    if (Array.isArray(type)) {
      type.map(value => resolveEnum(ChannelType, value));
      return this.cache.filter(channel => type.includes(channel.type as T));
    }

    const resolvedType = resolveEnum(ChannelType, type);

    return this.cache.filter(channel => channel.type === resolvedType);
  }

  /** @DJSProtofy */
  send<T extends string>(channel: ChannelResolvable, payload: T): Promise<Result>;
  send<T extends MessageCreateOptions>(channel: ChannelResolvable, payload: T): Promise<Result>;
  send<T extends MessagePayload>(channel: ChannelResolvable, payload: T): Promise<Result>;
  send<T extends string | MessageCreateOptions | MessagePayload>(channel: ChannelResolvable, payload: T): Promise<Result>;
  async send(channelResolvable: ChannelResolvable, payload: any): Promise<Result> {
    const channelId = this.resolveId(channelResolvable);
    if (typeof channelId !== "string") return { success: false };

    const channel = this.resolve(channelResolvable) ?? await this.fetch(channelId).catch(() => null);
    if (channel) {
      if (!channel.isTextBased()) return { success: false };
      return await channel.send(payload)
        .then(message => ({ message, success: true }))
        .catch(error => ({ error, success: false }));
    }

    if (!this.client.shard) return { success: false };

    return await this.client.shard.broadcastEval(async (shard, { channelId, payload }) => {
      const channel = shard.channels.getById(channelId);
      if (!channel?.isTextBased()) return;
      return await channel.send(payload);
    }, { context: { channelId, payload } })
      .then(res => res.find(Boolean) as any)
      .then(data => data ? { message: createBroadcastedMessage(this.client, data), success: true } : { success: false })
      .catch(error => ({ error, success: false }));
  }

  /** @DJSProtofy */
  searchBy<T extends string>(query: T): Channel | undefined;
  searchBy<T extends RegExp>(query: T): Channel | undefined;
  searchBy<T extends Search>(query: T): Channel | undefined;
  searchBy<T extends string | RegExp | Search>(query: T): Channel | undefined;
  searchBy<T extends string | RegExp | Search>(query: T[]): Collection<string, Channel>;
  searchBy<T extends string | RegExp | Search>(query: T | T[]) {
    if (Array.isArray(query)) return this._searchByMany(query);
    if (typeof query === "string") return this._searchByString(query);
    if (isRegExp(query)) return this._searchByRegExp(query);

    return typeof query.id === "string" && this.cache.get(query.id) ||
      this.cache.find(channel =>
        "name" in channel && typeof channel.name === "string" && (
          typeof query.name === "string" && compareStrings(query.name, channel.name) ||
          isRegExp(query.name) && query.name.test(channel.name)
        ) ||
        "topic" in channel && channel.topic && (
          typeof query.name === "string" && compareStrings(query.name, channel.topic) ||
          isRegExp(query.name) && query.name.test(channel.topic)
        ));
  }

  /** @DJSProtofy */
  protected _searchByMany(queries: (string | RegExp | Search)[]) {
    const cache: this["cache"] = new Collection();
    for (const query of queries) {
      const result = this.searchBy(query);
      if (result) cache.set(result.id, result);
    }
    return cache;
  }

  /** @DJSProtofy */
  protected _searchByRegExp(query: RegExp) {
    return this.cache.find((channel) =>
      ("name" in channel && typeof channel.name === "string" && query.test(channel.name)) ||
      ("topic" in channel && typeof channel.topic === "string" && query.test(channel.topic)));
  }

  /** @DJSProtofy */
  protected _searchByString(query: string) {
    query = replaceMentionCharacters(query);
    return this.cache.get(query) ??
      this.cache.find((channel) => [
        "name" in channel && channel.name?.toLowerCase(),
        "topic" in channel && channel.topic?.toLowerCase(),
      ].includes(query.toLowerCase()));
  }
}

interface Search {
  id?: string
  name?: string | RegExp
  topic?: string | RegExp
}

interface Result {
  error?: Error
  message?: Message
  success: boolean
}
