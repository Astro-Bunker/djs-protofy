import { ChannelType, Collection, GuildChannelManager, type CategoryChannel, type GuildBasedChannel, type GuildChannelType, type VoiceBasedChannel } from "discord.js";
import { isRegExp } from "util/types";
import { type GuildChannelTypeString, type GuildChannelWithType } from "../@types";
import { compareStrings, exists, replaceMentionCharacters, resolveEnum } from "../utils";

export class GuildChannels {
  declare cache: GuildChannelManager["cache"];

  constructor() {
    Object.defineProperties(GuildChannelManager.prototype, {
      getById: { value: this.getById },
      getByName: { value: this.getByName },
      getByTopic: { value: this.getByTopic },
      getByUrl: { value: this.getByUrl },
      getCategoryById: { value: this.getCategoryById },
      getCategoryByName: { value: this.getCategoryByName },
      getVoiceByUserId: { value: this.getVoiceByUserId },
      filterByTypes: { value: this.filterByTypes },
      searchBy: { value: this.searchBy },
      _searchByMany: { value: this._searchByMany },
      _searchByRegExp: { value: this._searchByRegExp },
      _searchByString: { value: this._searchByString },
    });
  }

  /** @DJSProtofy */
  getById(id: string): GuildBasedChannel | undefined;
  getById<T extends GuildChannelType | GuildChannelTypeString>(id: string, type: T): GuildChannelWithType<T> | undefined;
  getById(id: string, type?: GuildChannelType | GuildChannelTypeString) {
    const channel = this.cache.get(id);
    if (!exists(type)) return channel;
    if (channel?.type === resolveEnum(ChannelType, type)) return channel;
  }

  /** @DJSProtofy */
  getByName(name: string | RegExp): GuildBasedChannel | undefined;
  getByName<T extends GuildChannelType | GuildChannelTypeString>(name: string | RegExp, type: T): GuildChannelWithType<T> | undefined;
  getByName(name: string | RegExp, type?: GuildChannelType | GuildChannelTypeString) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    const resolvedType = exists(type) && resolveEnum(ChannelType, type);

    return this.cache.find(channel => {
      if (exists(type) && channel.type !== resolvedType) return false;

      if ("name" in channel && channel.name) {
        if (typeof name === "string") {
          return compareStrings(channel.name, name);
        }

        return name.test(channel.name);
      }
    });
  }

  /** @DJSProtofy */
  getByTopic(topic: string | RegExp): GuildBasedChannel | undefined;
  getByTopic<T extends GuildChannelType | GuildChannelTypeString>(topic: string | RegExp, type: T): GuildChannelWithType<T> | undefined;
  getByTopic(topic: string | RegExp, type?: GuildChannelType | GuildChannelTypeString) {
    if (typeof topic !== "string" && !isRegExp(topic)) return;

    const resolvedType = exists(type) && resolveEnum(ChannelType, type);

    return this.cache.find(channel => {
      if (exists(type) && channel.type !== resolvedType) return false;

      if ("topic" in channel && channel.topic) {
        if (typeof topic === "string")
          return compareStrings(channel.topic, topic);

        return topic.test(channel.topic);
      }
    });
  }

  /** @DJSProtofy */
  getByUrl(url: string): GuildBasedChannel | undefined;
  getByUrl<T extends GuildChannelType | GuildChannelTypeString>(url: string, type: T): GuildChannelWithType<T> | undefined;
  getByUrl(url: string, type?: ChannelType | GuildChannelTypeString) {
    type = resolveEnum(ChannelType, type as ChannelType);

    return this.cache.find(channel => channel.url === url && (exists(type) ? channel.type === type : true));
  }

  /** @DJSProtofy */
  getCategoryById(id: string) {
    const category = this.cache.get(id);
    if (category?.type !== ChannelType.GuildCategory) return;
    return category;
  }

  /** @DJSProtofy */
  getCategoryByName(name: string | RegExp) {
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
  getVoiceByUserId(id: string): VoiceBasedChannel | undefined {
    if (typeof id !== "string") return;

    return this.cache.find((channel) => {
      if (!channel.isVoiceBased()) return false;

      return channel.members.has(id);
    }) as VoiceBasedChannel;
  }

  /** @DJSProtofy */
  filterByTypes<T extends GuildChannelType | GuildChannelTypeString>(type: T | T[]): Collection<string, GuildChannelWithType<T>>;
  filterByTypes<T extends GuildChannelType | GuildChannelTypeString>(type: T | T[]) {
    if (Array.isArray(type)) {
      type.map(value => resolveEnum(ChannelType, value));
      return this.cache.filter(channel => type.includes(channel.type as T));
    }

    const resolvedType = resolveEnum(ChannelType, type);

    return this.cache.filter(channel => channel.type === resolvedType);
  }

  /** @DJSProtofy */
  searchBy<T extends string>(query: T): GuildBasedChannel | undefined;
  searchBy<T extends RegExp>(query: T): GuildBasedChannel | undefined;
  searchBy<T extends Search>(query: T): GuildBasedChannel | undefined;
  searchBy<T extends string | RegExp | Search>(query: T): GuildBasedChannel | undefined;
  searchBy<T extends string | RegExp | Search>(query: T[]): Collection<string, GuildBasedChannel>;
  searchBy<T extends string | RegExp | Search>(query: T | T[]) {
    if (Array.isArray(query)) return this._searchByMany(query);
    if (typeof query === "string") return this._searchByString(query);
    if (isRegExp(query)) return this._searchByRegExp(query);

    return typeof query.id === "string" && this.cache.get(query.id) ||
      this.cache.find(channel =>
        typeof query.name === "string" && compareStrings(query.name, channel.name) ||
        isRegExp(query.name) && query.name.test(channel.name) ||
        "topic" in channel && typeof channel.topic === "string" && (
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
      query.test(channel.name) ||
      ("topic" in channel && typeof channel.topic === "string" && query.test(channel.topic)));
  }

  /** @DJSProtofy */
  protected _searchByString(query: string) {
    query = replaceMentionCharacters(query);
    return this.cache.get(query) ??
      this.cache.find((channel) => [
        channel.name.toLowerCase(),
        "topic" in channel && channel.topic?.toLowerCase(),
      ].includes(query.toLowerCase()));
  }
}

interface Search {
  id?: string
  name?: string | RegExp
  topic?: string | RegExp
}
