import { type APIActionRowComponent, type APIActionRowComponentTypes, type APIMessageActionRowComponent, type APISelectMenuComponent, type APISelectMenuDefaultValue, type APISelectMenuOption, type APIStringSelectComponent, type ActionRow, ActionRowBuilder, type ComponentBuilder, ComponentType, type JSONEncodable, type MessageActionRowComponent, type MessageActionRowComponentBuilder, type SelectMenuDefaultValueType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, createComponentBuilder } from "discord.js";
import { isRegExp } from "util/types";
import { DiscordLimits } from "../@enum";
import { type APISelectMenuComponentWithDefaultValue } from "../@types";

const selectMenuTypes = new Set([
  ComponentType.StringSelect,
  ComponentType.UserSelect,
  ComponentType.RoleSelect,
  ComponentType.MentionableSelect,
  ComponentType.ChannelSelect,
]);

export function getDefaultOptionFromSelectMenu(
  components: JSONEncodable<APIActionRowComponent<APIActionRowComponentTypes>>[],
  customId?: string | RegExp,
) {
  if (!Array.isArray(components)) throw TypeError("components is not a array");

  let optionDefault: APISelectMenuOption | undefined;

  components.some(row =>
    row.toJSON().components.some(element =>
      "options" in element &&
      (typeof customId === "string" ? element.custom_id === customId
        : isRegExp(customId) ? customId.test(element.custom_id) : true) &&
      element.options.some(option =>
        option.default && (optionDefault = option))));

  return optionDefault;
}

export function getDefaultOptionsFromSelectMenu(
  components: JSONEncodable<APIActionRowComponent<APIActionRowComponentTypes>>[],
  customId?: string | RegExp,
) {
  if (!Array.isArray(components)) throw TypeError("components is not a array");

  const defaultOptions: APISelectMenuOption[] = [];

  for (let i = 0; i < components.length; i++) {
    const row = components[i].toJSON();

    if (row.components.length > DiscordLimits.ActionRowSelectMenus) continue;

    for (let j = 0; j < row.components.length; j++) {
      const column = row.components[j];

      if (!("options" in column) || column.options.length > DiscordLimits.SelectMenuOptions) continue;

      if (customId) {
        if (typeof customId === "string") {
          if (customId !== column.custom_id) continue;
        } else if (isRegExp(customId)) {
          if (!customId.test(column.custom_id)) continue;
        }
      }

      for (let k = 0; k < column.options.length; k++) {
        const option = column.options[k];

        if (option.default) defaultOptions.push(option);
      }
    }
  }

  return defaultOptions;
}

export function getDefaultValuesFromSelectMenu<D extends SelectMenuDefaultValueType>(
  components: JSONEncodable<APIActionRowComponent<APIActionRowComponentTypes>>[],
  callback: (selectMenu: APISelectMenuComponent, rowIndex: number) => boolean,
): APISelectMenuDefaultValue<D>[]
export function getDefaultValuesFromSelectMenu<D extends SelectMenuDefaultValueType>(
  components: JSONEncodable<APIActionRowComponent<APIActionRowComponentTypes>>[],
  customId?: string | RegExp,
): APISelectMenuDefaultValue<D>[]
export function getDefaultValuesFromSelectMenu(
  components: JSONEncodable<APIActionRowComponent<APIActionRowComponentTypes>>[],
  customId?: any,
) {
  if (!Array.isArray(components)) throw TypeError("components is not a array");

  if (typeof customId === "function") return getDefaultValuesFromSelectMenuWithCallback(components, customId);

  const defaultValues: any[] = [];

  for (let i = 0; i < components.length; i++) {
    const row = components[i].toJSON();

    if (row.components.length > DiscordLimits.ActionRowSelectMenus) continue;

    for (let j = 0; j < row.components.length; j++) {
      const column = row.components[j];

      if (!("default_values" in column) || !Array.isArray(column.default_values)) continue;

      if (customId) {
        if (typeof customId === "string") {
          if (customId === column.custom_id)
            defaultValues.push(...column.default_values);
          continue;
        }

        if (isRegExp(customId)) {
          if (customId.test(column.custom_id))
            defaultValues.push(...column.default_values);
          continue;
        }

        continue;
      }

      defaultValues.push(...column.default_values);
    }
  }

  return defaultValues;
}

function getDefaultValuesFromSelectMenuWithCallback<D extends SelectMenuDefaultValueType>(
  components: JSONEncodable<APIActionRowComponent<APIActionRowComponentTypes>>[],
  callback: (selectMenu: APISelectMenuComponentWithDefaultValue<D>, rowIndex: number) => boolean,
): APISelectMenuDefaultValue<D>[]
function getDefaultValuesFromSelectMenuWithCallback(
  components: JSONEncodable<APIActionRowComponent<APIActionRowComponentTypes>>[],
  callback: (selectMenu: any, rowIndex: number) => boolean,
) {
  if (!Array.isArray(components)) throw TypeError("components is not a array");
  if (typeof callback !== "function") throw TypeError("callback is not a function");

  const default_values: any[] = [];

  for (let i = 0; i < components.length; i++) {
    const row = components[i].toJSON();

    if (row.components.length > DiscordLimits.ActionRowSelectMenus) continue;

    for (const column of row.components) {
      if (!("default_values" in column) || !Array.isArray(column.default_values) || !callback(column, i)) continue;
      default_values.push(...column.default_values);
    }
  }

  return default_values;
}

export function mapSelectMenus<
  T extends ActionRow<MessageActionRowComponent> | ActionRowBuilder<MessageActionRowComponentBuilder>
>(
  components: T[],
  callback: (selectMenu: APISelectMenuComponent, rowIndex: number) =>
    APISelectMenuComponent | ComponentBuilder<APISelectMenuComponent> | null,
) {
  if (!Array.isArray(components)) throw TypeError("components is not a array");
  if (typeof callback !== "function") throw TypeError("callback is not a function");

  return components.reduce<T[]>((accRows, row, rowIndex) => {
    const rowJson = row.toJSON() as APIActionRowComponent<APIMessageActionRowComponent>;

    if (!rowJson.components.length) return accRows;
    if (!selectMenuTypes.has(rowJson.components[0]?.type)) return accRows.concat(row);

    const menus = rowJson.components.reduce<ComponentBuilder<APISelectMenuComponent>[]>((accMenus, menu) => {
      const result = callback(menu as APISelectMenuComponent, rowIndex);
      // @ts-expect-error ts(2769)
      if (result) return accMenus.concat(createComponentBuilder(result));
      return accMenus;
    }, []);

    if (menus.length) return accRows.concat(new ActionRowBuilder<any>().addComponents(menus) as T);

    return accRows;
  }, []);
}

export function mapSelectMenuOptions<
  T extends ActionRow<MessageActionRowComponent> | ActionRowBuilder<MessageActionRowComponentBuilder>
>(
  components: T[],
  callback: (option: APISelectMenuOption, rowIndex: number, optionIndex: number, menu: APIStringSelectComponent) =>
    APISelectMenuOption | JSONEncodable<APISelectMenuOption> | null,
) {
  if (!Array.isArray(components)) throw TypeError("components is not a array");
  if (typeof callback !== "function") throw TypeError("callback is not a function");

  return components.reduce<T[]>((accRows, row, rowIndex) => {
    const rowJson = row.toJSON() as APIActionRowComponent<APIStringSelectComponent>;

    if (!rowJson.components.length) return accRows;
    if (!("options" in rowJson.components[0])) return accRows.concat(row);
    if (!rowJson.components[0].options.length) return accRows;

    const rowComponents = rowJson.components.reduce<StringSelectMenuBuilder[]>((accMenus, menu) => {
      const options = menu.options.reduce<StringSelectMenuOptionBuilder[]>((accOptions, option, optionIndex) => {
        const result = callback(option, rowIndex, optionIndex, menu);
        if (result) return accOptions.concat(StringSelectMenuOptionBuilder.from(result));
        return accOptions;
      }, []);

      if (options.length) {
        return accMenus.concat(new StringSelectMenuBuilder({
          custom_id: menu.custom_id,
          disabled: menu.disabled,
          max_values: typeof menu.max_values === "number" ? Math.min(options.length, menu.max_values) : undefined,
          min_values: typeof menu.min_values === "number" ? Math.min(options.length, menu.min_values) : undefined,
          placeholder: menu.placeholder,
        })
          .addOptions(options));
      }

      return accMenus;
    }, []);

    if (rowComponents.length) return accRows.concat(new ActionRowBuilder().addComponents(rowComponents) as T);

    return accRows;
  }, []);
}
