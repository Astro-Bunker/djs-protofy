import { Guild, GuildMember, GuildMemberRoleManager, PermissionFlagsBits, PermissionsBitField } from "discord.js";

export class GMember {
  declare id: string;
  declare guild: Guild;
  declare permissions: Readonly<PermissionsBitField>;
  declare roles: GuildMemberRoleManager;

  constructor() {
    Object.defineProperties(GuildMember.prototype, {
      bannableBy: { value: this.bannableBy },
      kickableBy: { value: this.kickableBy },
      manageableBy: { value: this.manageableBy },
      moderatableBy: { value: this.moderatableBy },
    });
  }

  bannableBy(member: GuildMember) {
    return this.manageableBy(member) && member.permissions.has(PermissionFlagsBits.BanMembers);
  }

  kickableBy(member: GuildMember) {
    return this.manageableBy(member) && member.permissions.has(PermissionFlagsBits.KickMembers);
  }

  manageableBy(member: GuildMember) {
    if (this.id === this.guild.ownerId) return false;
    if (this.id === member.id) return false;
    if (this.guild.ownerId === member.id) return true;
    return member.roles.highest.comparePositionTo(this.roles.highest) > 0;
  }

  moderatableBy(member: GuildMember) {
    return (
      !this.permissions.has(PermissionFlagsBits.Administrator) &&
      this.manageableBy(member) &&
      member.permissions.has(PermissionFlagsBits.ModerateMembers)
    );
  }
}
