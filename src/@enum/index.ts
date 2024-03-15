/* eslint-disable @typescript-eslint/no-duplicate-enum-values */

export const enum ApplicationCommandChoiceLimits {
  /** 1-100 character choice name */
  Name = 100,
  /** Value for the choice, up to 100 characters if string */
  Value = 100,
}

export const enum ApplicationCommandOptionLimits {
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

/**
 * https://discord.com/developers/docs/interactions/application-commands#application-command-object
 */
export const enum ApplicationCommandLimits {
  /** Name of command, 1-32 characters */
  Name = 32,
  /** Description for `CHAT_INPUT` commands, 1-100 characters. Empty string for `USER` and `MESSAGE` commands */
  Description = 100,
  /** Parameters for the command, max of 25 */
  Options = 25,
}

export const enum EmbedFieldLimits {
  Name = 256,
  Value = 1024,
}

/**
 * https://discord.com/developers/docs/resources/channel#embed-object-embed-limits
 */
export const enum EmbedLimits {
  Title = 256,
  Description = 4096,
  Fields = 25,
  FooterText = 2048,
  AuthorName = 256,
}

export const enum ActionRowLimits {
  Buttons = 5,
  SelectMenus = 1,
  TextInputs = 1,
}

export const enum ButtonLimits {
  /** Developer-defined identifier for the button; max 100 characters */
  CustomId = 100,
  /** Text that appears on the button; max 80 characters */
  Label = 80,
}

export const enum SelectMenuOptionLimits {
  /** User-facing name of the option; max 100 characters */
  Label = 100,
  /** Dev-defined value of the option; max 100 characters */
  Value = 100,
  /** Additional description of the option; max 100 characters */
  Description = 100,
}

export const enum SelectMenuLimits {
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

/**
 * https://discord.com/developers/docs/resources/channel#create-message-jsonform-params
 */
export const enum MessageLimits {
  /** Message contents (up to 2000 characters) */
  Content = 2000,
  /** Components to include with the message */
  Components = 5,
  /** Up to 10 `rich` embeds (up to 6000 characters) */
  Embeds = 10,
  Total = 6000,
}

export const enum TextInputLimits {
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
