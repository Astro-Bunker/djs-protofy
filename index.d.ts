/* eslint-disable no-var */
import type { EnumLike, MessageFlags } from "discord.js";
import type { setTimeout } from "timers/promises";
import type { DiscordStringLimits } from "./src/@enum";
import type { AwaitOptions } from "./src/@types";
import type { ApplicationCommandExtension } from "./src/prototypes/applicationCommand";
import type { ApplicationCommandManagerExtension } from "./src/prototypes/applicationCommands";
import type { ArrayExtension } from "./src/prototypes/array";
import type { BaseInteractionExtension } from "./src/prototypes/baseInteraction";
import type { ChannelManagerExtension } from "./src/prototypes/channels";
import type { ClientExtension } from "./src/prototypes/client";
import type { CollectionExtension } from "./src/prototypes/collection";
import type { EmbedExtension } from "./src/prototypes/embed";
import type { EmbedBuilderExtension } from "./src/prototypes/embedBuilder";
import type { BaseGuildEmojiManagerExtension } from "./src/prototypes/emojis";
import type { GuildBanManagerExtension } from "./src/prototypes/guildBans";
import type { GuildChannelManagerExtension } from "./src/prototypes/guildChannels";
import type { GuildEmojiManagerExtension } from "./src/prototypes/guildEmojis";
import type { GuildMemberExtension } from "./src/prototypes/guildMember";
import type { GuildMemberManagerExtension } from "./src/prototypes/guildMembers";
import type { GuildMessageManagerExtension } from "./src/prototypes/guildMessages";
import type { GuildManagerExtension } from "./src/prototypes/guilds";
import type { MessageExtension } from "./src/prototypes/message";
import type { MessageManagerExtension } from "./src/prototypes/messages";
import type { RoleManagerExtension } from "./src/prototypes/roles";
import type { SetExtension } from "./src/prototypes/set";
import type { ShardClientUtilExtension } from "./src/prototypes/shardClientUtil";
import type { StringExtension } from "./src/prototypes/string";
import type { UserManagerExtension } from "./src/prototypes/users";

export * from "./src";

declare module "discord.js" {
  interface ApplicationCommand<PermissionsFetchType = {}> extends ApplicationCommandExtension<PermissionsFetchType> { }

  interface ApplicationCommandManager<
    ApplicationCommandScope = ApplicationCommand<{ guild: GuildResolvable; }>,
    PermissionsOptionsExtras = { guild: GuildResolvable; },
    PermissionsGuildType = null
    > extends ApplicationCommandManagerExtension<
    ApplicationCommandScope,
    PermissionsOptionsExtras,
    PermissionsGuildType,
  > { }

  interface BaseGuildEmojiManager extends BaseGuildEmojiManagerExtension { }

  interface BaseInteraction<Cached extends CacheType = CacheType> extends BaseInteractionExtension<Cached> { }

  interface ChannelManager extends ChannelManagerExtension { }

  interface Client<Ready> extends ClientExtension<Ready> {
    awaitReady(): Promise<this is Client<true>>;
    awaitReady(options: AwaitOptions): Promise<this is Client<true>>;
  }

  interface Embed extends EmbedExtension { }

  interface EmbedBuilder extends EmbedBuilderExtension { }

  interface GuildBanManager extends GuildBanManagerExtension { }

  interface GuildChannelManager extends GuildChannelManagerExtension { }

  interface GuildEmojiManager extends GuildEmojiManagerExtension { }

  interface GuildMember extends GuildMemberExtension { }

  interface GuildMemberManager extends GuildMemberManagerExtension { }

  interface GuildMessageManager extends GuildMessageManagerExtension { }

  interface GuildManager extends GuildManagerExtension { }

  interface Message<InGuild extends boolean = boolean> extends MessageExtension<InGuild> { }

  interface MessageManager<InGuild extends boolean = boolean> extends MessageManagerExtension<InGuild> { }

  interface RoleManager extends RoleManagerExtension { }

  interface ShardClientUtil extends ShardClientUtilExtension { }

  interface UserManager extends UserManagerExtension { }

  interface Collection<K, V> extends CollectionExtension<K, V> { }
}

declare global {
  /** @DJSProtofy */
  var animated: true;
  /** @DJSProtofy */
  var disabled: true;
  /**
   * @DJSProtofy
   * @deprecated Supplying `ephemeral` for interaction response options is deprecated. Utilize flags instead.
   */
  var ephemeral: true;
  /**
   * @DJSProtofy 
   * @deprecated Supplying `fetchReply` for interaction response options is deprecated. Utilize `withResponse` instead or fetch the response after using the method.
   */
  var fetchReply: true;
  /**
   * @DJSProtofy
   * @description Shortcut for the `MessageFlags#Ephemeral` flag
   */
  var flags: MessageFlags.Ephemeral
  /** @DJSProtofy */
  var inline: true;
  /** @DJSProtofy */
  var required: true;
  /** @DJSProtofy */
  var withResponse: true;

  /** @DJSProtofy */
  declare function sleep<T = void>(...args: Parameters<typeof setTimeout<T>>): ReturnType<typeof setTimeout<T>>;

  interface Array<T> extends ArrayExtension<T> {
    random(): T
    random(amount: number): T[]
    random(amount: number, allowDuplicates: boolean): T[]
    random(amount: any): T;
  }

  interface Set<T> extends SetExtension<T> { }

  interface String extends StringExtension {
    limit<T extends typeof DiscordStringLimits>(size: keyof T | T[keyof T], enumLike?: T): string
    limit<T extends EnumLike>(size: keyof T | T[keyof T] | number, enumLike: T): string
    limit(size: number): string
  }
}
