import { Channel, Client, Collection, GuildMember, Message, Role, User } from "discord.js";
const guilds = new Set<string>();

export class DjsMessage {
  declare guild: Message["guild"];
  declare mentions: Message["mentions"];
  declare content: Message["content"];
  declare client: Client;

  constructor() {
    Object.defineProperties(Message.prototype, {
      parseMemberMentions: { value: this.parseMemberMentions },
    });
  }

  async parseMemberMentions(): Promise<Collection<string, GuildMember>> {
    if (!this.guild) return new Collection();

    if (!guilds.has(this.guild.id))
      await this.guild.members.fetch().catch(() => null);
    guilds.add(this.guild.id);

    if (!this.content.length)
      return this.mentions.members || new Collection();

    const queries = new Set(this.content.trim().split(/ /g));

    for (const query of queries) {
      const member = this.guild?.members.searchBy(query);
      if (member?.id) this.mentions.members?.set(member.id, member);
    }

    return this.mentions.members || new Collection();
  }

  async parseUserMentions(): Promise<Collection<string, User>> {
    return new Collection();
  }

  parseRoleMentions(): Collection<string, Role> {
    if (!this.guild) return new Collection();

    const queries = new Set(this.content.trim().split(/ /g));

    for (const query of queries) {
      if (this.mentions.roles.has(query)) continue;

      const role = this.guild.roles.searchBy(query);
      if (role?.id) this.mentions.roles.set(role.id, role);
    }

    return this.mentions.roles;
  }

  parseChannelMentions(): Collection<string, Channel> {
    if (!this.guild) return new Collection();

    const queries = new Set(this.content.trim().split(/ /g));

    for (const query of queries) {
      if (this.mentions.channels.has(query)) continue;

      const channel = this.guild.channels.searchBy(query);
      if (channel?.id) this.mentions.channels.set(channel.id, channel);
    }

    return this.mentions.channels;
  }

}
