import { ChannelType, type CategoryChannelType, type GuildChannelType, type GuildTextChannelType, type TextChannelType, type ThreadChannelType } from "discord.js";

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

/**
 * Interaction `tokens` are valid for **15 minutes** and can be used to send followup messages but you **must send an initial response within 3 seconds of receiving the event**. If the 3 second deadline is exceeded, the token will be invalidated.
 * 
 * https://discord.com/developers/docs/interactions/receiving-and-responding#interaction-callback
 */
export const InteractionTokenExpirationTime = 900_000;
