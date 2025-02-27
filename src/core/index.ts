import { MessageFlags } from "discord.js";
import { setTimeout as sleep } from "timers/promises";
import { ApplicationCommandExtension } from "../prototypes/ApplicationCommand";
import { ApplicationCommandManagerExtension } from "../prototypes/ApplicationCommands";
import { ArrayExtension } from "../prototypes/Array";
import { BaseInteractionExtension } from "../prototypes/BaseInteraction";
import { ChannelManagerExtension } from "../prototypes/Channels";
import { ClientExtension } from "../prototypes/Client";
import { CollectionExtension } from "../prototypes/Collection";
import { EmbedExtension } from "../prototypes/Embed";
import { EmbedBuilderExtension } from "../prototypes/EmbedBuilder";
import { BaseGuildEmojiManagerExtension } from "../prototypes/Emojis";
import { GuildBanManagerExtension } from "../prototypes/GuildBans";
import { GuildChannelManagerExtension } from "../prototypes/GuildChannels";
import { GuildEmojiManagerExtension } from "../prototypes/GuildEmojis";
import { GuildMemberExtension } from "../prototypes/GuildMember";
import { GuildMemberManagerExtension } from "../prototypes/GuildMembers";
import { GuildMessageManagerExtension } from "../prototypes/GuildMessages";
import { GuildManagerExtension } from "../prototypes/Guilds";
import { MessageExtension } from "../prototypes/Message";
import { MessageManagerExtension } from "../prototypes/Messages";
import { RoleManagerExtension } from "../prototypes/Roles";
import { SetExtension } from "../prototypes/Set";
import { ShardClientUtilExtension } from "../prototypes/ShardClientUtil";
import { StringExtension } from "../prototypes/String";
import { UserManagerExtension } from "../prototypes/Users";
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
