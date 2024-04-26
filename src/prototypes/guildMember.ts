import { GuildMember, GuildMemberResolvable, PermissionFlagsBits } from "discord.js";

export class SGuildMember {
  declare id: string;
  declare guild: GuildMember["guild"];
  declare permissions: GuildMember["permissions"];
  declare roles: GuildMember["roles"];

  constructor() {
    Object.defineProperties(GuildMember.prototype, {
      bannableBy: { value: this.bannableBy },
      kickableBy: { value: this.kickableBy },
      manageableBy: { value: this.manageableBy },
      moderatableBy: { value: this.moderatableBy },
    });
  }

  /** @DJSProtofy */
  bannableBy(member: GuildMemberResolvable) {
    member = this.guild.members.resolve(member)!;
    if (!member) return false;
    return this.manageableBy(member) && member.permissions.has(PermissionFlagsBits.BanMembers);
  }

  /** @DJSProtofy */
  kickableBy(member: GuildMemberResolvable) {
    member = this.guild.members.resolve(member)!;
    if (!member) return false;
    return this.manageableBy(member) && member.permissions.has(PermissionFlagsBits.KickMembers);
  }

  /** @DJSProtofy */
  manageableBy(member: GuildMemberResolvable) {
    member = this.guild.members.resolve(member)!;
    if (!member) return false;
    if (this.id === this.guild.ownerId) return false;
    if (this.id === member.id) return false;
    if (this.guild.ownerId === member.id) return true;
    return member.roles.highest.comparePositionTo(this.roles.highest) > 0;
  }

  /** @DJSProtofy */
  moderatableBy(member: GuildMemberResolvable) {
    member = this.guild.members.resolve(member)!;
    if (!member) return false;
    return (
      !this.permissions.has(PermissionFlagsBits.Administrator) &&
      this.manageableBy(member) &&
      member.permissions.has(PermissionFlagsBits.ModerateMembers)
    );
  }
}
