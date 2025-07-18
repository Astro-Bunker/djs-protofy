import { Collection, GatewayIntentBits, Message, type Channel, type GuildBasedChannel, type GuildMember, type Role, type User } from "discord.js";
import { ManyDiscordSnowflakesPattern } from "../utils/regexps";

export default class MessageExtension<InGuild extends boolean = boolean> {
  declare client: Message<InGuild>["client"];
  declare content: Message<InGuild>["content"];
  declare guild: Message<InGuild>["guild"];
  declare mentions: Message<InGuild>["mentions"];

  constructor() {
    Object.defineProperties(Message.prototype, {
      parseMentions: { value: this.parseMentions },
      parseChannelMentions: { value: this.parseChannelMentions },
      parseMemberMentions: { value: this.parseMemberMentions },
      parseRoleMentions: { value: this.parseRoleMentions },
      parseUserMentions: { value: this.parseUserMentions },
    });
  }

  /** @DJSProtofy */
  async parseMentions() {
    await Promise.allSettled([
      this.parseChannelMentions(),
      this.parseRoleMentions(),
      this.parseMemberMentions(),
      this.parseUserMentions(),
    ]);
  }

  /** @DJSProtofy */
  async parseChannelMentions(): Promise<Collection<string, Channel>> {
    const queries = new Set(this.content.trim().split(/\s+/g));

    for (const query of queries) {
      if (this.mentions.channels.has(query)) continue;

      // @ts-expect-error ts(2349)
      const channel = (this.guild ?? this.client).channels.searchBy(query) as Channel | GuildBasedChannel;

      if (!channel || this.mentions.channels.has(channel.id)) continue;

      this.mentions.channels.set(channel.id, channel);
    }

    return this.mentions.channels;
  }

  /** @DJSProtofy */
  async parseMemberMentions(): Promise<Collection<string, GuildMember>> {
    if (!this.guild) return this.mentions.members ?? new Collection();

    if (this.client.options.intents.has(GatewayIntentBits.GuildMembers)) {
      // @ts-expect-error ts(2339)
      if (!this.guild._membersHasAlreadyBeenFetched) {
        await this.guild.members.fetch({ time: 10000 }).catch(() => null);
        // @ts-expect-error ts(2339)
        this.guild._membersHasAlreadyBeenFetched = true;
      }
    } else {
      const users = Array.from(new Set(this.content.match(ManyDiscordSnowflakesPattern)));

      if (users.length) {
        for (let i = 0; i < users.length;) {
          const user = users.slice(i, i += 100);
          // eslint-disable-next-line no-await-in-loop
          await this.guild.members.fetch({ user, time: 1000 }).catch(() => null);
        }
      }
    }

    const queries = new Set(this.content.trim().split(/\s+/g));

    for (const query of queries) {
      if (this.mentions.members!.has(query)) continue;

      const member = this.guild.members.searchBy(query);

      if (!member || this.mentions.members!.has(member.id)) continue;

      this.mentions.members!.set(member.id, member);
    }

    return this.mentions.members!;
  }

  /** @DJSProtofy */
  async parseRoleMentions(): Promise<Collection<string, Role>> {
    if (!this.guild) return this.mentions.roles;

    const queries = new Set(this.content.trim().split(/\s+/g));

    for (const query of queries) {
      if (this.mentions.roles.has(query)) continue;

      const role = this.guild.roles.searchBy(query);

      if (!role || this.mentions.roles.has(role.id)) continue;

      this.mentions.roles.set(role.id, role);
    }

    return this.mentions.roles;
  }

  /** @DJSProtofy */
  async parseUserMentions(): Promise<Collection<string, User>> {
    const queries = new Set(this.content.trim().split(/\s+/g));

    for (const query of queries) {
      if (this.mentions.users.has(query)) continue;

      const user = this.client.users.searchBy(query);

      if (!user || this.mentions.users.has(user.id)) continue;

      this.mentions.users.set(user.id, user);
    }

    return this.mentions.users;
  }
}
