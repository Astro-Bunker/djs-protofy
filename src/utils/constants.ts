import { CategoryChannelType, ChannelType, GuildChannelType, GuildTextChannelType, TextChannelType, ThreadChannelType } from "discord.js";
import { readFileSync } from "fs";
import { join } from "path";

const packagePath = join(__dirname, "..", "..", "package.json");
const packageJSON = JSON.parse(readFileSync(packagePath, "utf8"));

export const suportedDJSVersion = Number(packageJSON.devDependencies["discord.js"].replace(/(^\D*)|(\D+.*$)/g, ""));

export const categoryChannelTypes: readonly CategoryChannelType[] = [
  ChannelType.GuildText,
  ChannelType.GuildVoice,
  ChannelType.GuildAnnouncement,
  ChannelType.GuildStageVoice,
  ChannelType.GuildForum,
  ChannelType.GuildMedia,
];

export const guildChannelTypes: readonly GuildChannelType[] = [
  ChannelType.GuildText,
  ChannelType.GuildVoice,
  ChannelType.GuildCategory,
  ChannelType.GuildAnnouncement,
  ChannelType.AnnouncementThread,
  ChannelType.PublicThread,
  ChannelType.PrivateThread,
  ChannelType.GuildStageVoice,
  ChannelType.GuildDirectory,
  ChannelType.GuildForum,
  ChannelType.GuildMedia,
];

export const guildTextChannelTypes: readonly GuildTextChannelType[] = [
  ChannelType.GuildText,
  ChannelType.GuildVoice,
  ChannelType.GuildAnnouncement,
  ChannelType.AnnouncementThread,
  ChannelType.PublicThread,
  ChannelType.PrivateThread,
  ChannelType.GuildStageVoice,
];

export const textChannelTypes: readonly TextChannelType[] = [
  ChannelType.GuildText,
  ChannelType.DM,
  ChannelType.GuildVoice,
  ChannelType.GroupDM,
  ChannelType.GuildAnnouncement,
  ChannelType.AnnouncementThread,
  ChannelType.PublicThread,
  ChannelType.PrivateThread,
  ChannelType.GuildStageVoice,
];

export const threadChannelTypes: readonly ThreadChannelType[] = [
  ChannelType.AnnouncementThread,
  ChannelType.PublicThread,
  ChannelType.PrivateThread,
];
