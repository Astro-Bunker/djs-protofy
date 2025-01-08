import { ChannelType, Collection, GuildChannelManager, type CategoryChannel, type GuildBasedChannel, type GuildChannelType, type VoiceBasedChannel } from "discord.js";
import { isRegExp, isSet } from "util/types";
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
    if (exists(type)) type = resolveEnum(ChannelType, type) as GuildChannelType;

    if (typeof name === "string") return this.cache.find(cached => {
      if (exists(type) && cached.type !== type) return false;
      return compareStrings(cached.name, name);
    });

    if (isRegExp(name)) return this.cache.find(cached => {
      if (exists(type) && cached.type !== type) return false;
      return name.test(cached.name);
    });
  }

  /** @DJSProtofy */
  getByTopic(topic: string | RegExp): GuildBasedChannel | undefined;
  getByTopic<T extends GuildChannelType | GuildChannelTypeString>(topic: string | RegExp, type: T): GuildChannelWithType<T> | undefined;
  getByTopic(topic: string | RegExp, type?: GuildChannelType | GuildChannelTypeString) {
    if (exists(type)) type = resolveEnum(ChannelType, type) as GuildChannelType;

    if (typeof topic === "string") return this.cache.find(cached => {
      if (exists(type) && cached.type !== type) return false;
      if ("topic" in cached && typeof cached.topic === "string") return compareStrings(cached.topic, topic);
      return false;
    });

    if (isRegExp(topic)) return this.cache.find(cached => {
      if (exists(type) && cached.type !== type) return false;
      if ("topic" in cached && typeof cached.topic === "string") return topic.test(cached.topic);
      return false;
    });
  }

  /** @DJSProtofy */
  getByUrl(url: string): GuildBasedChannel | undefined;
  getByUrl<T extends GuildChannelType | GuildChannelTypeString>(url: string, type: T): GuildChannelWithType<T> | undefined;
  getByUrl(url: string, type?: ChannelType | GuildChannelTypeString) {
    type = resolveEnum(ChannelType, type as ChannelType);

    return this.cache.find(cached => cached.url === url && (exists(type) ? cached.type === type : true));
  }

  /** @DJSProtofy */
  getCategoryById(id: string) {
    const category = this.cache.get(id);
    if (category?.type !== ChannelType.GuildCategory) return;
    return category;
  }

  /** @DJSProtofy */
  getCategoryByName(name: string | RegExp) {
    if (typeof name === "string") return this.cache.find(cached =>
      cached.type === ChannelType.GuildCategory &&
      compareStrings(cached.name, name)) as CategoryChannel;

    if (isRegExp(name)) return this.cache.find(cached =>
      cached.type === ChannelType.GuildCategory &&
      name.test(cached.name)) as CategoryChannel;
  }

  /** @DJSProtofy */
  getVoiceByUserId(id: string): VoiceBasedChannel | undefined {
    if (typeof id !== "string") return;

    return this.cache.find((cached) => cached.isVoiceBased() && cached.members.has(id)) as VoiceBasedChannel;
  }

  /** @DJSProtofy */
  filterByTypes<T extends GuildChannelType | GuildChannelTypeString>(type: T | T[]): Collection<string, GuildChannelWithType<T>>;
  filterByTypes<T extends GuildChannelType | GuildChannelTypeString>(type: T | T[] | Set<T>) {
    if (Array.isArray(type)) type = new Set(type.map(value => resolveEnum(ChannelType, value))) as Set<any>;

    if (isSet(type)) return this.cache.filter(cached => type.has(cached.type as T));

    const resolvedType = resolveEnum(ChannelType, type);

    return this.cache.filter(cached => cached.type === resolvedType);
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
      this.cache.find(cached =>
        typeof query.name === "string" && compareStrings(query.name, cached.name) ||
        isRegExp(query.name) && query.name.test(cached.name) ||
        "topic" in cached && typeof cached.topic === "string" && (
          typeof query.name === "string" && compareStrings(query.name, cached.topic) ||
          isRegExp(query.name) && query.name.test(cached.topic)
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
    return this.cache.find((cached) =>
      query.test(cached.name) ||
      ("topic" in cached && typeof cached.topic === "string" && query.test(cached.topic)));
  }

  /** @DJSProtofy */
  protected _searchByString(query: string) {
    query = replaceMentionCharacters(query).toLowerCase();
    return this.cache.get(query) ??
      this.cache.find((cached) => [
        cached.name.toLowerCase(),
        "topic" in cached && cached.topic?.toLowerCase(),
      ].includes(query));
  }
}

interface Search {
  id?: string
  name?: string | RegExp
  topic?: string | RegExp
}
