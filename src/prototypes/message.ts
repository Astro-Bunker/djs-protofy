import { Channel, Client, Collection, GuildMember, Message, Role, User } from "discord.js";

const guilds = new Set<string>();

export class DjsMessage {
  declare guild: Message["guild"];
  declare mentions: Message["mentions"];
  declare content: Message["content"];
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(Message.prototype, {
      parseChannelMentions: { value: this.parseChannelMentions },
      parseMemberMentions: { value: this.parseMemberMentions },
      parseRoleMentions: { value: this.parseRoleMentions },
      parseUserMentions: { value: this.parseUserMentions },
    });
  }

  parseChannelMentions(): Collection<string, Channel> {
    if (!this.guild) return new Collection();

    const queries = new Set(this.content.trim().split(/\s+/g));

    for (const query of queries) {
      if (this.mentions.channels.has(query)) continue;

      const channel = this.guild.channels.searchBy(query);

      if (channel?.id) {
        if (this.mentions.channels.has(channel.id)) continue;
        this.mentions.channels.set(channel.id, channel);
      }
    }

    return this.mentions.channels;
  }

  async parseMemberMentions(): Promise<Collection<string, GuildMember>> {
    if (!this.content || !this.guild || !this.mentions.members) return new Collection();

    if (!guilds.has(this.guild.id)) {
      await this.guild.members.fetch().catch(() => null);
      guilds.add(this.guild.id);
    }

    const queries = new Set(this.content.trim().split(/\s+/g));

    for (const query of queries) {
      if (this.mentions.members.has(query)) continue;

      const member = this.guild.members.searchBy(query);
      if (member?.id) {
        if (this.mentions.members.has(member.id)) continue;
        this.mentions.members.set(member.id, member);
      }
    }

    return this.mentions.members || new Collection();
  }

  parseRoleMentions(): Collection<string, Role> {
    if (!this.guild) return new Collection();

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
    if (!this.content) return new Collection();

    const ids = this.content.match(/\d{17,}/g);

    if (!ids) return new Collection();

    const users = await Promise.all(ids.map(id => this.client.users.fetch(id).catch(() => null)));

    for (const user of users) {
      if (!user) continue;
      if (this.mentions.users.has(user.id)) continue;

      this.mentions.users.set(user.id, user);
    }

    return this.mentions.users;
  }
}
