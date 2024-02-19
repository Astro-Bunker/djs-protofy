import { Channel, Collection, GatewayIntentBits, GuildMember, Message, Role, User } from "discord.js";

export class SMessage {
  declare client: Message["client"];
  declare content: Message["content"];
  declare guild: Message["guild"];
  declare mentions: Message["mentions"];

  constructor() {
    Object.defineProperties(Message.prototype, {
      parseMentions: { value: this.parseMentions },
      parseChannelMentions: { value: this.parseChannelMentions },
      parseMemberMentions: { value: this.parseMemberMentions },
      parseRoleMentions: { value: this.parseRoleMentions },
      parseUserMentions: { value: this.parseUserMentions },
    });
  }

  async parseMentions() {
    await Promise.all([
      new Promise(r => r(this.parseChannelMentions())),
      new Promise(r => r(this.parseRoleMentions())),
      this.parseMemberMentions(),
      this.parseUserMentions(),
    ]);
  }

  parseChannelMentions(): Collection<string, Channel> {
    const queries = new Set(this.content.trim().split(/\s+/g));

    for (const query of queries) {
      if (this.mentions.channels.has(query)) continue;

      const channel = (this.guild ?? this.client).channels.searchBy(query);

      if (channel?.id) {
        if (this.mentions.channels.has(channel.id)) continue;
        this.mentions.channels.set(channel.id, channel);
      }
    }

    return this.mentions.channels;
  }

  async parseMemberMentions(): Promise<Collection<string, GuildMember>> {
    if (!this.guild) return this.mentions.members ?? new Collection();

    if (this.client.options.intents.has(GatewayIntentBits.GuildMembers)) {
      // @ts-expect-error ts(2339)
      if (!this.guild._membersHasAlreadyBeenFetched) {
        await this.guild.members.fetch().catch(() => null);
        // @ts-expect-error ts(2339)
        this.guild._membersHasAlreadyBeenFetched = true;
      }
    } else {
      const user = Array.from(new Set(this.content.match(/\d{17,}/g)));

      if (user.length) await this.guild.members.fetch({ user, time: 1000 }).catch(() => null);
    }

    const queries = new Set(this.content.trim().split(/\s+/g));

    for (const query of queries) {
      if (this.mentions.members!.has(query)) continue;

      const member = this.guild.members.searchBy(query);
      if (member?.id) {
        if (this.mentions.members!.has(member.id)) continue;
        this.mentions.members!.set(member.id, member);
      }
    }

    return this.mentions.members!;
  }

  parseRoleMentions(): Collection<string, Role> {
    if (!this.guild) return this.mentions.roles;

    const queries = new Set(this.content.trim().split(/\s+/g));

    for (const query of queries) {
      if (this.mentions.roles.has(query)) continue;

      const role = this.guild.roles.searchBy(query);

      if (role?.id) {
        if (this.mentions.roles.has(role.id)) continue;
        this.mentions.roles.set(role.id, role);
      }
    }

    return this.mentions.roles;
  }

  async parseUserMentions(): Promise<Collection<string, User>> {
    const ids = this.content.match(/\d{17,}/g);

    if (!ids) return this.mentions.users;

    const users = await Promise.all(ids.map(id => this.client.users.fetch(id).catch(() => null)));

    for (const user of users.filter(Boolean) as User[]) {
      if (this.mentions.users.has(user.id)) continue;

      this.mentions.users.set(user.id, user);
    }

    return this.mentions.users;
  }
}
