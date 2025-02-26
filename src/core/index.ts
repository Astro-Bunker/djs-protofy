import { MessageFlags } from "discord.js";
import { setTimeout as sleep } from "timers/promises";
import { ApplicationCommandExtension } from "../prototypes/applicationCommand";
import { ApplicationCommandManagerExtension } from "../prototypes/applicationCommands";
import { ArrayExtension } from "../prototypes/array";
import { BaseInteractionExtension } from "../prototypes/baseInteraction";
import { ChannelManagerExtension } from "../prototypes/channels";
import { ClientExtension } from "../prototypes/client";
import { CollectionExtension } from "../prototypes/collection";
import { EmbedExtension } from "../prototypes/embed";
import { EmbedBuilderExtension } from "../prototypes/embedBuilder";
import { BaseGuildEmojiManagerExtension } from "../prototypes/emojis";
import { GuildBanManagerExtension } from "../prototypes/guildBans";
import { GuildChannelManagerExtension } from "../prototypes/guildChannels";
import { GuildEmojiManagerExtension } from "../prototypes/guildEmojis";
import { GuildMemberExtension } from "../prototypes/guildMember";
import { GuildMemberManagerExtension } from "../prototypes/guildMembers";
import { GuildMessageManagerExtension } from "../prototypes/guildMessages";
import { GuildManagerExtension } from "../prototypes/guilds";
import { MessageExtension } from "../prototypes/message";
import { MessageManagerExtension } from "../prototypes/messages";
import { RoleManagerExtension } from "../prototypes/roles";
import { SetExtension } from "../prototypes/set";
import { ShardClientUtilExtension } from "../prototypes/shardClientUtil";
import { StringExtension } from "../prototypes/string";
import { UserManagerExtension } from "../prototypes/users";
import { verifyDJSVersion } from "./utils/djsVersionValidator";

export class DJSProtofy {
  constructor() {
    verifyDJSVersion();

    Object.assign(globalThis, {
      animated: true,
      disabled: true,
      /** @deprecated */
      ephemeral: true,
      /** @deprecated */
      fetchReply: true,
      flags: MessageFlags.Ephemeral,
      inline: true,
      required: true,
      withResponse: true,
      sleep,
    });

    new ArrayExtension();
    new SetExtension();
    new StringExtension();

    new ApplicationCommandExtension();
    new ApplicationCommandManagerExtension();
    new BaseInteractionExtension();
    new ChannelManagerExtension();
    new ClientExtension();
    new CollectionExtension();
    new EmbedExtension();
    new EmbedBuilderExtension();
    new BaseGuildEmojiManagerExtension();
    new GuildBanManagerExtension();
    new GuildChannelManagerExtension();
    new GuildEmojiManagerExtension();
    new GuildMemberExtension();
    new GuildMemberManagerExtension();
    new GuildMessageManagerExtension();
    new GuildManagerExtension();
    new MessageExtension();
    new MessageManagerExtension();
    new RoleManagerExtension();
    new ShardClientUtilExtension();
    new UserManagerExtension();
  }
}
