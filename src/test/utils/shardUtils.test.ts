import { type APIDMChannel, type APITextChannel, ChannelType, Client, Guild, GuildDefaultMessageNotifications, GuildExplicitContentFilter, GuildHubType, GuildMFALevel, GuildNSFWLevel, GuildPremiumTier, GuildSystemChannelFlags, GuildVerificationLevel, Locale } from "discord.js";
import { type RawGuildData } from "discord.js/typings/rawDataTypes";
import assert from "node:assert";
import test, { describe } from "node:test";
import { createBroadcastedChannel } from "../../core/utils/shardUtils";

describe("Testing createBroadcastedChannel", () => {
  const client = new Client({ intents: [] });

  const dMchannel: APIDMChannel = {
    id: "id",
    name: null,
    type: 1,
  };

  test("Creating a DM channel", () => {
    assert.equal(createBroadcastedChannel(client, dMchannel)?.id, "id");
  });

  const rawGuildData: RawGuildData = {
    id: "id",
    afk_channel_id: null,
    afk_timeout: 60,
    application_id: null,
    banner: null,
    default_message_notifications: GuildDefaultMessageNotifications.OnlyMentions,
    description: null,
    discovery_splash: null,
    emojis: [],
    explicit_content_filter: GuildExplicitContentFilter.Disabled,
    features: [],
    hub_type: GuildHubType.Default,
    icon: null,
    mfa_level: GuildMFALevel.None,
    name: "name",
    nsfw_level: GuildNSFWLevel.Default,
    owner_id: "owner_id",
    preferred_locale: Locale.EnglishUS,
    premium_progress_bar_enabled: false,
    premium_tier: GuildPremiumTier.None,
    public_updates_channel_id: null,
    roles: [],
    rules_channel_id: null,
    safety_alerts_channel_id: null,
    splash: null,
    stickers: [],
    system_channel_flags: GuildSystemChannelFlags.SuppressJoinNotifications,
    system_channel_id: null,
    unavailable: false,
    vanity_url_code: null,
    verification_level: GuildVerificationLevel.None,
  };

  // @ts-expect-error ts(2673)
  const guild = new Guild(client, rawGuildData);

  client.guilds.cache.set(guild.id, guild);

  const guildTextChannel: APITextChannel = {
    id: "id",
    name: "name",
    position: 0,
    type: ChannelType.GuildText,
    guild_id: guild.id,
  };

  test("Creating a guild text channel", () => {
    assert.equal(createBroadcastedChannel(client, guildTextChannel)?.id, "id");
  });
});
