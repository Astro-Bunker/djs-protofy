import { MessageFlags } from "discord.js";
import { setTimeout as sleep } from "timers/promises";
import ApplicationCommandExtension from "../prototypes/ApplicationCommand";
import ApplicationCommandManagerExtension from "../prototypes/ApplicationCommandManager";
import ApplicationEmojiManagerExtension from "../prototypes/ApplicationEmojiManager";
import ArrayExtension from "../prototypes/Array";
import BaseGuildEmojiManagerExtension from "../prototypes/BaseGuildEmojiManager";
import BaseInteractionExtension from "../prototypes/BaseInteraction";
import ChannelManagerExtension from "../prototypes/ChannelManager";
import ClientExtension from "../prototypes/Client";
import CollectionExtension from "../prototypes/Collection";
import EmbedExtension from "../prototypes/Embed";
import EmbedBuilderExtension from "../prototypes/EmbedBuilder";
import GuildBanManagerExtension from "../prototypes/GuildBanManager";
import GuildChannelManagerExtension from "../prototypes/GuildChannelManager";
import GuildEmojiManagerExtension from "../prototypes/GuildEmojiManager";
import GuildManagerExtension from "../prototypes/GuildManager";
import GuildMemberExtension from "../prototypes/GuildMember";
import GuildMemberManagerExtension from "../prototypes/GuildMemberManager";
import GuildMessageManagerExtension from "../prototypes/GuildMessageManager";
import MessageExtension from "../prototypes/Message";
import MessageManagerExtension from "../prototypes/MessageManager";
import RoleManagerExtension from "../prototypes/RoleManager";
import SetExtension from "../prototypes/Set";
import ShardClientUtilExtension from "../prototypes/ShardClientUtil";
import StringExtension from "../prototypes/String";
import UserManagerExtension from "../prototypes/UserManager";
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
    new ApplicationEmojiManagerExtension();
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
