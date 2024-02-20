import { CategoryChannel, ChannelType, Client, Collection, GuildBasedChannel, GuildChannelManager, GuildChannelType, VoiceBasedChannel } from "discord.js";
import { isRegExp } from "util/types";
import { GuildChannelTypeString, GuildChannelWithType } from "../@types";
import { compareStrings, resolveEnum } from "../utils";

export class GuildChannels {
  declare cache: GuildChannelManager["cache"];
  declare client: Client<true>;

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

  getById(id: string): GuildBasedChannel | undefined;
  getById<T extends GuildChannelType | GuildChannelTypeString>(id: string, type: T): GuildChannelWithType<T> | undefined;
  getById(id: string, type?: GuildChannelType | GuildChannelTypeString) {
    const channel = this.cache.get(id);
    if (type === undefined) return channel;
    if (channel?.type === resolveEnum(ChannelType, type)) return channel;
  }

  getByName(name: string | RegExp): GuildBasedChannel | undefined;
  getByName<T extends GuildChannelType | GuildChannelTypeString>(name: string | RegExp, type: T): GuildChannelWithType<T> | undefined;
  getByName(name: string | RegExp, type?: GuildChannelType | GuildChannelTypeString) {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(channel => {
      if (type && channel.type !== resolveEnum(ChannelType, type)) return false;

      if ("name" in channel && channel.name) {
        if (typeof name === "string") {
          return compareStrings(channel.name, name);
        }

        return name.test(channel.name);
      }
    });
  }

  getByTopic(topic: string | RegExp): GuildBasedChannel | undefined;
  getByTopic<T extends GuildChannelType | GuildChannelTypeString>(topic: string | RegExp, type: T): GuildChannelWithType<T> | undefined;
  getByTopic(topic: string | RegExp, type?: GuildChannelType | GuildChannelTypeString) {
    if (typeof topic !== "string" && !isRegExp(topic)) return;

    return this.cache.find(channel => {
      if (type && channel.type !== resolveEnum(ChannelType, type)) return false;

      if ("topic" in channel && channel.topic) {
        if (typeof topic === "string")
          return compareStrings(channel.topic, topic);

        return topic.test(channel.topic);
      }
    });
  }

  getByUrl(url: string): GuildBasedChannel | undefined;
  getByUrl<T extends GuildChannelType | GuildChannelTypeString>(url: string, type: T): GuildChannelWithType<T> | undefined;
  getByUrl(url: string, type?: ChannelType | GuildChannelTypeString) {
    type = resolveEnum(ChannelType, type as ChannelType);

    return this.cache.find(channel => channel.url === url && (type ? channel.type === type : true));
  }

  getCategoryById(id: string) {
    const category = this.cache.get(id);
    if (category?.type !== ChannelType.GuildCategory) return;
    return category;
  }

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

  getVoiceByUserId(id: string): VoiceBasedChannel | undefined {
    if (typeof id !== "string") return;

    return this.cache.find((channel) => {
      if (!channel.isVoiceBased()) return false;

      return channel.members.has(id);
    }) as VoiceBasedChannel;
  }

  filterByTypes<T extends GuildChannelType | GuildChannelTypeString>(type: T | T[]): Collection<string, GuildChannelWithType<T>>;
  filterByTypes<T extends GuildChannelType | GuildChannelTypeString>(type: T | T[]){
    if (Array.isArray(type)) {
      type.map(value => resolveEnum(ChannelType, value));
      return this.cache.filter(channel => type.includes(channel.type as T));
    }

    const resolvedType = resolveEnum(ChannelType, type);

    return this.cache.filter(channel => channel.type === resolvedType);
  }

  searchBy<T extends string | RegExp>(query: T): GuildBasedChannel | undefined;
  searchBy<T extends Search>(query: T): GuildBasedChannel | undefined;
  searchBy<T extends string | RegExp | Search>(query: T): GuildBasedChannel | undefined;
  searchBy<T extends string | RegExp | Search>(query: T[]): Collection<string, GuildBasedChannel>;
  searchBy<T extends string | RegExp | Search>(query: T | T[]) {
    if (Array.isArray(query)) return this._searchByMany(query);
    if (typeof query === "string") return this._searchByString(query);
    if (isRegExp(query)) return this._searchByRegExp(query);

    return this.cache.find(channel =>
      (
        query.id && (
          typeof query.id === "string" ?
            compareStrings(query.id, channel.id) :
            query.id.test(channel.id)
        )
      ) || (
        query.name && (
          typeof query.name === "string" ?
            compareStrings(query.name, channel.name) :
            query.name.test(channel.name)
        )
      ) || (
        query.name && "topic" in channel && channel.topic && (
          typeof query.name === "string" ?
            compareStrings(query.name, channel.topic) :
            query.name.test(channel.topic)
        )
      ));
  }

  protected _searchByMany(queries: (string | RegExp | Search)[]) {
    const cache: this["cache"] = new Collection();
    for (const query of queries) {
      const result = this.searchBy(query);
      if (result) cache.set(result.id, result);
    }
    return cache;
  }

  protected _searchByRegExp(query: RegExp) {
    return this.cache.find((channel) =>
      query.test(channel.id) ||
      query.test(channel.name) ||
      (("topic" in channel && channel.topic) && query.test(channel.topic)));
  }

  protected _searchByString(query: string) {
    return this.cache.get(query) ??
      this.cache.find((channel) => [
        channel.name.toLowerCase(),
        "topic" in channel && channel.topic?.toLowerCase(),
      ].includes(query.toLowerCase()));
  }
}

interface Search {
  id?: string | RegExp
  name?: string | RegExp
}
