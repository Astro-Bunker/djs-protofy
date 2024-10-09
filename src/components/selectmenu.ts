import { type APIActionRowComponent, type APIActionRowComponentTypes, type APIMessageActionRowComponent, type APISelectMenuComponent, type APISelectMenuDefaultValue, type APISelectMenuOption, type APIStringSelectComponent, type ActionRow, ActionRowBuilder, type ComponentBuilder, ComponentType, type JSONEncodable, type MessageActionRowComponent, type MessageActionRowComponentBuilder, type SelectMenuDefaultValueType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, createComponentBuilder } from "discord.js";
import { exists } from "../utils";

const selectMenuTypes = [
  ComponentType.StringSelect,
  ComponentType.UserSelect,
  ComponentType.RoleSelect,
  ComponentType.MentionableSelect,
  ComponentType.ChannelSelect,
];

export function getDefaultOptionFromSelectMenu(
  components: JSONEncodable<APIActionRowComponent<APIActionRowComponentTypes>>[],
  customId?: string,
) {
  let optionDefault: APISelectMenuOption | undefined;

  components?.some(row =>
    row.toJSON().components.some(element =>
      "options" in element &&
      (typeof customId === "string" ? element.custom_id === customId : true) &&
      element.options.some(option =>
        option.default && (optionDefault = option))));

  return optionDefault;
}

export function getDefaultValuesFromSelectMenu<D extends SelectMenuDefaultValueType>(
  components: JSONEncodable<APIActionRowComponent<APIActionRowComponentTypes>>[],
  customId?: string,
) {
  let default_values: APISelectMenuDefaultValue<D>[] | undefined;

  components?.some(row =>
    row.toJSON().components.some(column =>
      "default_values" in column &&
      (typeof customId === "string" ? column.custom_id === customId : true) &&
      // @ts-expect-error ts(2322)
      (default_values = column.default_values)));

  return default_values ?? [];
}

export function mapSelectMenus<
  T extends ActionRow<MessageActionRowComponent> | ActionRowBuilder<MessageActionRowComponentBuilder>
>(
  components: T[],
  callback: (selectMenu: APISelectMenuComponent, rowIndex: number) =>
    APISelectMenuComponent | ComponentBuilder<APISelectMenuComponent> | null,
) {
  if (!Array.isArray(components)) throw Error("components is not a array");
  if (typeof callback !== "function") throw Error("callback is not a function");

  return components.reduce<T[]>((accRows, row, rowIndex) => {
    const rowJson = row.toJSON() as APIActionRowComponent<APIMessageActionRowComponent>;

    if (!selectMenuTypes.includes(rowJson.components[0]?.type)) return accRows.concat(row);

    const menus = rowJson.components.reduce<ComponentBuilder<APISelectMenuComponent>[]>((accMenus, menu) => {
      const result = callback(menu as APISelectMenuComponent, rowIndex);
      // @ts-expect-error ts(2769)
      if (exists(result)) return accMenus.concat(createComponentBuilder(result));
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
  if (!Array.isArray(components)) throw Error("components is not a array");
  if (typeof callback !== "function") throw Error("callback is not a function");

  return components.reduce<T[]>((accRows, row, rowIndex) => {
    const rowJson = row.toJSON() as APIActionRowComponent<APIStringSelectComponent>;

    if (exists(rowJson.components[0])) {
      if (!("options" in rowJson.components[0])) return accRows.concat(row);
      if (!rowJson.components[0].options.length) return accRows;
    }

    const rowComponents = rowJson.components.reduce<StringSelectMenuBuilder[]>((accMenus, menu) => {
      const options = menu.options.reduce<StringSelectMenuOptionBuilder[]>((accOptions, option, optionIndex) => {
        const result = callback(option, rowIndex, optionIndex, menu);
        if (exists(result)) return accOptions.concat(StringSelectMenuOptionBuilder.from(result));
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
