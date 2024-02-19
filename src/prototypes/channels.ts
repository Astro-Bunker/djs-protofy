import { APIChannel, CategoryChannel, ChannelManager, ChannelType, Client, Collection, VoiceBasedChannel } from "discord.js";
import { isRegExp } from "util/types";
import { ChannelTypeString, ChannelWithType } from "../@types";
import { compareStrings, resolveEnum, serializeRegExp } from "../utils";

export class Channels {
  declare cache: ChannelManager["cache"];
  declare client: Client<true>;

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
    });
  }

  getById<T extends ChannelType | ChannelTypeString>(id: string, type?: T): ChannelWithType<T> | undefined {
    const channel = this.cache.get(id);
    if (type === undefined) return channel as ChannelWithType<T>;
    if (channel?.type === resolveEnum(ChannelType, type)) return channel as ChannelWithType<T>;
  }

  getByName<T extends ChannelType | ChannelTypeString>(name: string | RegExp, type?: T): ChannelWithType<T> | undefined {
    if (typeof name !== "string" && !isRegExp(name)) return;

    return this.cache.find(channel => {
      if (type && channel.type !== resolveEnum(ChannelType, type)) return false;

      if ("name" in channel && channel.name) {
        if (typeof name === "string") {
          return compareStrings(channel.name, name);
        }

        return name.test(channel.name);
      }
    }) as ChannelWithType<T>;
  }

  getByTopic<T extends ChannelType | ChannelTypeString>(topic: string | RegExp, type?: T): ChannelWithType<T> | undefined {
    if (typeof topic !== "string" && !isRegExp(topic)) return;

    return this.cache.find(channel => {
      if (type && channel.type !== resolveEnum(ChannelType, type)) return false;

      if ("topic" in channel && channel.topic) {
        if (typeof topic === "string")
          return compareStrings(channel.topic, topic);

        return topic.test(channel.topic);
      }
    }) as ChannelWithType<T>;
  }

  getByUrl(url: string) {
    return this.cache.find(channel => channel.url === url);
  }

  getCategoryById(id: string) {
    if (typeof id !== "string") return;
    const category = this.cache.get(id);
    if (category?.type !== ChannelType.GuildCategory) return;
    return category;
  }

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

  async getInShardsById(id: string) {
    if (typeof id !== "string" || !this.client.shard) return null;

    return await this.client.shard.broadcastEval((shard, id) => shard.channels.getById(id), { context: id })
      .then(res => res.find(Boolean) as APIChannel ?? null)
      .catch(() => null);
  }

  async getInShardsByName(name: string | RegExp) {
    if ((typeof name !== "string" && !isRegExp(name)) || !this.client.shard) return null;

    const context = serializeRegExp(name);

    return await this.client.shard.broadcastEval((shard, { flags, isRegExp, source }) =>
      shard.channels.getByName(isRegExp ? RegExp(source, flags) : source), { context })
      .then(res => res.find(Boolean) as APIChannel ?? null)
      .catch(() => null);
  }

  getVoiceByUserId(id: string): VoiceBasedChannel | undefined {
    if (typeof id !== "string") return;

    return this.cache.find((channel) => {
      if (!channel.isVoiceBased()) return false;

      return channel.members.has(id);
    }) as VoiceBasedChannel;
  }

  filterByTypes<T extends ChannelType | ChannelTypeString>(type: T | T[]): Collection<string, ChannelWithType<T>> {
    if (Array.isArray(type)) {
      type.map(value => resolveEnum(ChannelType, value));
      return this.cache.filter(channel => type.includes(channel.type as T)) as Collection<string, ChannelWithType<T>>;
    }

    return this.cache.filter(channel => channel.type === resolveEnum(ChannelType, type)) as Collection<string, ChannelWithType<T>>;
  }

  searchBy(query: string | RegExp | Search) {
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
        query.name && "name" in channel && channel.name && (
          typeof query.name === "string" ?
            (compareStrings(query.name, channel.name)) :
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

  protected _searchByRegExp(query: RegExp) {
    return this.cache.find((channel) =>
      query.test(channel.id) ||
      (("name" in channel && channel.name) && query.test(channel.name)) ||
      (("topic" in channel && channel.topic) && query.test(channel.topic)));
  }

  protected _searchByString(query: string) {
    return this.cache.get(query) ??
      this.cache.find((channel) => [
        ("name" in channel && channel.name) && channel.name,
        ("topic" in channel && channel.topic) && channel.topic,
      ].includes(query.toLowerCase()));
  }
}

interface Search {
  id?: string | RegExp
  name?: string | RegExp
}
