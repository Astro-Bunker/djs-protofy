/* eslint-disable no-var */
import type { EnumLike, MessageFlags } from "discord.js";
import type { setTimeout } from "timers/promises";
import type { DiscordStringLimits } from "./src/@enum";
import type { AwaitOptions } from "./src/@types";
import type ApplicationCommandExtension from "./src/prototypes/ApplicationCommand";
import type ApplicationCommandManagerExtension from "./src/prototypes/ApplicationCommandManager";
import type ApplicationEmojiManagerExtension from "./src/prototypes/ApplicationEmojiManager";
import type ArrayExtension from "./src/prototypes/Array";
import type BaseGuildEmojiManagerExtension from "./src/prototypes/BaseGuildEmojiManager";
import type BaseInteractionExtension from "./src/prototypes/BaseInteraction";
import type ChannelManagerExtension from "./src/prototypes/ChannelManager";
import type ClientExtension from "./src/prototypes/Client";
import type CollectionExtension from "./src/prototypes/Collection";
import type EmbedExtension from "./src/prototypes/Embed";
import type EmbedBuilderExtension from "./src/prototypes/EmbedBuilder";
import type GuildBanManagerExtension from "./src/prototypes/GuildBanManager";
import type GuildChannelManagerExtension from "./src/prototypes/GuildChannelManager";
import type GuildEmojiManagerExtension from "./src/prototypes/GuildEmojiManager";
import type GuildEmojiRoleManagerExtension from "./src/prototypes/GuildEmojiRoleManager";
import type GuildManagerExtension from "./src/prototypes/GuildManager";
import type GuildMemberExtension from "./src/prototypes/GuildMember";
import type GuildMemberManagerExtension from "./src/prototypes/GuildMemberManager";
import type GuildMemberRoleManagerExtension from "./src/prototypes/GuildMemberRoleManager";
import type GuildMessageManagerExtension from "./src/prototypes/GuildMessageManager";
import type MessageExtension from "./src/prototypes/Message";
import type MessageManagerExtension from "./src/prototypes/MessageManager";
import type RoleManagerExtension from "./src/prototypes/RoleManager";
import type SetExtension from "./src/prototypes/Set";
import type ShardClientUtilExtension from "./src/prototypes/ShardClientUtil";
import type StringExtension from "./src/prototypes/String";
import type UserManagerExtension from "./src/prototypes/UserManager";

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

  interface ApplicationEmojiManager extends ApplicationEmojiManagerExtension { }

  interface BaseGuildEmojiManager extends BaseGuildEmojiManagerExtension { }

  interface BaseInteraction<Cached extends CacheType = CacheType> extends BaseInteractionExtension<Cached> { }

  interface ChannelManager extends ChannelManagerExtension { }

  interface Client<Ready> extends ClientExtension<Ready> {
    awaitReady(): Promise<this is Client<true>>;
    awaitReady(options: AwaitOptions): Promise<this is Client<true>>;
  }

  interface Collection<K, V> extends CollectionExtension<K, V> { }

  interface Embed extends EmbedExtension { }

  interface EmbedBuilder extends EmbedBuilderExtension { }

  interface GuildBanManager extends GuildBanManagerExtension { }

  interface GuildChannelManager extends GuildChannelManagerExtension { }

  interface GuildEmojiManager extends GuildEmojiManagerExtension { }

  interface GuildEmojiRoleManager extends GuildEmojiRoleManagerExtension { }

  interface GuildMember extends GuildMemberExtension { }

  interface GuildMemberManager extends GuildMemberManagerExtension { }

  interface GuildMemberRoleManager extends GuildMemberRoleManagerExtension { }

  interface GuildMessageManager extends GuildMessageManagerExtension { }

  interface GuildManager extends GuildManagerExtension { }

  interface Message<InGuild extends boolean = boolean> extends MessageExtension<InGuild> { }

  interface MessageManager<InGuild extends boolean = boolean> extends MessageManagerExtension<InGuild> { }

  interface RoleManager extends RoleManagerExtension { }

  interface ShardClientUtil extends ShardClientUtilExtension { }

  interface UserManager extends UserManagerExtension { }
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
