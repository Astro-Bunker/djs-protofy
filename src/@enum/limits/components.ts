/* eslint-disable @typescript-eslint/no-duplicate-enum-values */

/** https://discord.com/developers/docs/components/reference#action-row */
export enum ActionRowLimits {
  Buttons = 5,
  /** Up to 5 interactive button components or a single select component */
  Components = 5,
  SelectMenus = 1,
  TextInputs = 1,
}

/** https://discord.com/developers/docs/components/reference#button */
export enum ButtonLimits {
  /** Developer-defined identifier for the button; max 100 characters */
  CustomId = 100,
  /** Text that appears on the button; max 80 characters */
  Label = 80,
}

/** https://discord.com/developers/docs/components/reference#container */
export enum ContainerLimits {
  /** Up to 10 components of the type `action row`, `text display`, `section`, `media gallery`, `separator`, or `file` */
  Components = 10,
}

/** https://discord.com/developers/docs/components/reference#media-gallery */
export enum MediaGalleyLimits {
  /** 1 to 10 media gallery items */
  Items = 10,
}

/** https://discord.com/developers/docs/components/reference#section */
export enum SectionLimits {
  /** One to three text components */
  Components = 3,
  TextDisplays = 3,
}

/**
 * https://discord.com/developers/docs/components/reference#string-select
 * https://discord.com/developers/docs/components/reference#user-select
 * https://discord.com/developers/docs/components/reference#role-select
 * https://discord.com/developers/docs/components/reference#mentionable-select
 * https://discord.com/developers/docs/components/reference#mentionable-select
 */
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

/** https://discord.com/developers/docs/components/reference#string-select-select-option-structure */
export enum SelectMenuOptionLimits {
  /** User-facing name of the option; max 100 characters */
  Label = 100,
  /** Dev-defined value of the option; max 100 characters */
  Value = 100,
  /** Additional description of the option; max 100 characters */
  Description = 100,
}

/** https://discord.com/developers/docs/components/reference#string-select-select-option-structure */
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
