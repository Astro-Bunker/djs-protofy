import { GuildMember, PermissionFlagsBits, type GuildMemberResolvable } from "discord.js";

export default class GuildMemberExtension {
  declare id: GuildMember["id"];
  declare guild: GuildMember["guild"];
  declare permissions: GuildMember["permissions"];
  declare roles: GuildMember["roles"];

  constructor() {
    Object.defineProperties(GuildMember.prototype, {
      bannableBy: { value: this.bannableBy },
      kickableBy: { value: this.kickableBy },
      manageableBy: { value: this.manageableBy },
      moderatableBy: { value: this.moderatableBy },
      isAdministrator: { value: this.isAdministrator },
      isGuildManager: { value: this.isGuildManager },
      isGuildOwner: { value: this.isGuildOwner },
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

  /** @DJSProtofy */
  isAdministrator() {
    return this.permissions.has(PermissionFlagsBits.Administrator);
  }

  /** @DJSProtofy */
  isGuildManager() {
    return this.permissions.has(PermissionFlagsBits.ManageGuild);
  }

  /** @DJSProtofy */
  isGuildOwner() {
    return this.id === this.guild.ownerId;
  }
}
