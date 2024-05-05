/* eslint-disable @typescript-eslint/no-duplicate-enum-values */

/** https://discord.com/developers/docs/interactions/message-components#component-object */
export enum ActionRowLimits {
  Buttons = 5,
  SelectMenus = 1,
  TextInputs = 1,
}

/** https://discord.com/developers/docs/interactions/application-commands */
export enum ApplicationCommandLimits {
  /** Name of command, 1-32 characters */
  Name = 32,
  /** Description for `CHAT_INPUT` commands, 1-100 characters. Empty string for `USER` and `MESSAGE` commands */
  Description = 100,
  /** Parameters for the command, max of 25 */
  Options = 25,
}

/** https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-choice-structure */
export enum ApplicationCommandChoiceLimits {
  /** 1-100 character choice name */
  Name = 100,
  /** Value for the choice, up to 100 characters if string */
  Value = 100,
}

/** https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-option-structure */
export enum ApplicationCommandOptionLimits {
  /** 1-32 character name */
  Name = 32,
  /** 1-100 character description */
  Description = 100,
  /** Choices for `STRING`, `INTEGER`, and `NUMBER` types for the user to pick from, max 25 */
  Choices = 25,
  /** For option type `STRING`, the minimum allowed length (minimum of `0`, maximum of `6000`) */
  MinLength = 6000,
  /** For option type `STRING`, the maximum allowed length (minimum of `1`, maximum of `6000`) */
  MaxLength = 6000,
}

/** https://discord.com/developers/docs/resources/auto-moderation#auto-moderation-rule-object-auto-moderation-rule-structure */
export enum AutoModerationRuleLimits {
  /** the rule name */
  Name = 100,
  /** the role ids that should not be affected by the rule (Maximum of 20) */
  ExemptRoles = 20,
  /** the channel ids that should not be affected by the rule (Maximum of 50) */
  ExemptChannels = 20,
}

export enum BanLimits {
  Reason = 512,
}

export enum ButtonLimits {
  /** Developer-defined identifier for the button; max 100 characters */
  CustomId = 100,
  /** Text that appears on the button; max 80 characters */
  Label = 80,
}

/** https://discord.com/developers/docs/resources/channel#channel-object */
export enum ForumOrMediaChannelLimits {
  /** the name of the channel (1-100 characters) */
  Name = 100,
  /** the channel topic (0-4096 characters for `GUILD_FORUM` and `GUILD_MEDIA` channels, 0-1024 characters for all others) */
  Topic = 4096
}

/** https://discord.com/developers/docs/resources/channel#channel-object */
export enum ChannelLimits {
  /** the name of the channel (1-100 characters) */
  Name = 100,
  /** the channel topic (0-4096 characters for `GUILD_FORUM` and `GUILD_MEDIA` channels, 0-1024 characters for all others) */
  Topic = 1024,
}

export enum EmbedFieldLimits {
  Name = 256,
  Value = 1024,
}

/** https://discord.com/developers/docs/resources/channel#embed-object-embed-limits */
export enum EmbedLimits {
  Title = 256,
  Description = 4096,
  Fields = 25,
  FooterText = 2048,
  AuthorName = 256,
}

/** https://discord.com/developers/docs/resources/emoji */
export enum EmojiLimits {
  Name = 32,
}

export enum GuildLimits {
  /** guild name (2-100 characters, excluding trailing and leading whitespace) */
  Name = 100,
  /** the description of a guild */
  Description = 120,
}

/** https://discord.com/developers/docs/resources/guild#guild-member-object */
export enum GuildMemberLimits {
  /** this user's guild nickname */
  Nick = 32,
}

/** https://discord.com/developers/docs/resources/guild-scheduled-event */
export enum GuildScheduledEventLimits {
  /** the name of the scheduled event (1-100 characters) */
  Name = 100,
  /** the description of the scheduled event (1-1000 characters) */
  Description = 1000,
}

export enum KickLimits {
  Reason = 512,
}

/** https://discord.com/developers/docs/resources/channel#message-object */
export enum MessageLimits {
  /** contents of the message */
  Content = 2000,
  /** sent if the message contains components like buttons, action rows, or other interactive components */
  Components = 5,
  /** Up to 10 `rich` embeds (up to 6000 characters) */
  Embeds = 10,
  Total = 6000,
}

/** https://discord.com/developers/docs/resources/poll */
export enum PollLimits {
  /** Each of the answers available in the poll, up to 10 */
  Answers = 10,
  /** Number of hours the poll should be open for, up to 7 days */
  Duration = 168,
}

export enum PollMediaLimits {
  /** The text of the field */
  text = 300,
}

export enum PollMediaAnswerLimits {
  /** The text of the field */
  text = 55,
}

export enum RoleLimits {
  /** name of the role, max 100 characters */
  Name = 100,
}

export enum SelectMenuOptionLimits {
  /** User-facing name of the option; max 100 characters */
  Label = 100,
  /** Dev-defined value of the option; max 100 characters */
  Value = 100,
  /** Additional description of the option; max 100 characters */
  Description = 100,
}

export enum SelectMenuLimits {
  /** ID for the select menu; max 100 characters */
  CustomId = 100,
  /** Minimum number of items that must be chosen (defaults to 1); min 0, max 25 */
  MinValues = 25,
  /** Maximum number of items that can be chosen (defaults to 1); max 25 */
  MaxValues = 25,
  /** Specified choices in a select menu (only required and available for string selects (type `3`); max 25 */
  Options = 25,
  /** Placeholder text if nothing is selected; max 150 characters */
  Placeholder = 150,
}

/** https://discord.com/developers/docs/resources/stage-instance */
export enum StageInstanceLimits {
  Topic = 120,
}

/** https://discord.com/developers/docs/resources/sticker */
export enum StickerLimits {
  Name = 30,
  Description = 100,
  Tags = 200,
}

export enum TextInputLimits {
  /** Developer-defined identifier for the input; max 100 characters */
  CustomId = 100,
  /** Label for this component; max 45 characters */
  Label = 45,
  /** Minimum input length for a text input; min 0, max 4000 */
  MinLength = 4000,
  /** Maximum input length for a text input; min 1, max 4000 */
  MaxLength = 4000,
  /** Pre-filled value for this component; max 4000 characters */
  Value = 4000,
  /** Custom placeholder text if the input is empty; max 100 characters */
  Placeholder = 100,
}

export enum UserLimits {
  /** the user's username, not unique across the platform */
  Username = 32,
  /** the user's display name, if it is set. For bots, this is the application name */
  GlobalName = 32,
}

/** https://discord.com/developers/docs/resources/webhook */
export enum WebhookLimits {
  /** the default name of the webhook */
  Name = 80,
}

export enum DiscordLimits {
  ActionRowButtons = 5,
  ActionRowSelectMenus = 1,
  ActionRowTextInputs = 1,
  ApplicationCommandName = 32,
  ApplicationCommandDescription = 100,
  ApplicationCommandOptions = 25,
  ApplicationCommandOptionName = 32,
  ApplicationCommandOptionDescription = 100,
  ApplicationCommandOptionChoices = 25,
  ApplicationCommandOptionMinLength = 6000,
  ApplicationCommandOptionMaxLength = 6000,
  ApplicationCommandChoiceName = 100,
  ApplicationCommandChoiceValue = 100,
  AutoModerationRuleName = 100,
  AutoModerationRuleExemptRoles = 20,
  AutoModerationRuleExemptChannels = 20,
  BanReason = 512,
  ButtonCustomId = 100,
  ButtonLabel = 80,
  ChannelName = 100,
  ChannelTopic = 1024,
  ForumOrMediaChannelTopic = 4096,
  EmbedTitle = 256,
  EmbedDescription = 4096,
  EmbedFields = 25,
  EmbedFooterText = 2048,
  EmbedAuthorName = 256,
  EmbedFieldName = 256,
  EmbedFieldValue = 1024,
  EmojiName = 32,
  GuildName = 100,
  GuildDescription = 120,
  GuildMemberNick = 32,
  GuildScheduledEventName = 100,
  GuildScheduledEvent = 1000,
  KickReason = 512,
  MessageComponents = 5,
  MessageContent = 2000,
  MessageEmbeds = 10,
  MessageTotal = 6000,
  PollAnswers = 10,
  PollDuration = 168,
  PollMediaText = 300,
  PollMediaAnswerText = 55,
  RoleName = 100,
  SelectMenuCustomId = 100,
  SelectMenuMinValues = 25,
  SelectMenuMaxValues = 25,
  SelectMenuOptions = 25,
  SelectMenuPlaceholder = 150,
  SelectMenuOptionLabel = 100,
  SelectMenuOptionValue = 100,
  SelectMenuOptionDescription = 100,
  StageInstanceTopic = 120,
  StickerName = 30,
  StickerDescription = 100,
  StickerTags = 200,
  TextInputCustomId = 100,
  TextInputLabel = 45,
  TextInputMinLength = 4000,
  TextInputMaxLength = 4000,
  TextInputValue = 4000,
  TextInputPlaceholder = 100,
  UserUsername = 32,
  UserGlobalName = 32,
  WebhookName = 80,
}

export enum DiscordStringLimits {
  ApplicationCommandName = 32,
  ApplicationCommandDescription = 100,
  ApplicationCommandOptionName = 32,
  ApplicationCommandOptionDescription = 100,
  ApplicationCommandChoiceName = 100,
  ApplicationCommandChoiceValue = 100,
  AutoModerationRuleName = 100,
  BanReason = 512,
  ButtonCustomId = 100,
  ButtonLabel = 80,
  ChannelName = 100,
  ChannelTopic = 1024,
  ForumOrMediaChannelTopic = 4096,
  EmbedTitle = 256,
  EmbedDescription = 4096,
  EmbedFooterText = 2048,
  EmbedAuthorName = 256,
  EmbedFieldName = 256,
  EmbedFieldValue = 1024,
  GuildName = 100,
  GuildDescription = 120,
  GuildMemberNick = 32,
  GuildScheduledEventName = 100,
  GuildScheduledEventDescription = 1000,
  KickReason = 512,
  MessageContent = 2000,
  MessageTotal = 6000,
  PollMediaText = 300,
  PollMediaAnswerText = 55,
  RoleName = 100,
  SelectMenuCustomId = 100,
  SelectMenuPlaceholder = 150,
  SelectMenuOptionLabel = 100,
  SelectMenuOptionValue = 100,
  SelectMenuOptionDescription = 100,
  StageInstanceTopic = 120,
  StickerName = 30,
  StickerDescription = 100,
  StickerTags = 200,
  TextInputCustomId = 100,
  TextInputLabel = 45,
  TextInputValue = 4000,
  TextInputPlaceholder = 100,
  UserUsername = 32,
  UserGlobalName = 32,
  WebhookName = 80,
}
