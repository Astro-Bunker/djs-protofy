import { type APIMessageComponent, type APISelectMenuComponent, type APISelectMenuDefaultValue, type APISelectMenuOption, type APIStringSelectComponent, ComponentType, type JSONEncodable, type SelectMenuDefaultValueType } from "discord.js";
import { isRegExp } from "util/types";
import { mapComponents } from "./components";

const selectMenuTypes = Object.freeze(new Set([
  ComponentType.StringSelect,
  ComponentType.UserSelect,
  ComponentType.RoleSelect,
  ComponentType.MentionableSelect,
  ComponentType.ChannelSelect,
]));

export function getDefaultOptionsFromSelectMenus(
  components: JSONEncodable<APIMessageComponent>[],
  customId?: string | RegExp,
) {
  if (!Array.isArray(components)) throw TypeError("components is not a array");

  const defaultOptions: APISelectMenuOption[] = [];

  for (let i = 0; i < components.length; i++) {
    const component = components[i].toJSON();

    if ("components" in component) {
      const options = recursiveGetDefaultOptionsFromAPISelectMenus(component.components, customId);
      defaultOptions.push(...options);
      continue;
    }

    if (!("options" in component)) continue;

    if (customId) {
      if (typeof customId === "string") {
        if (customId !== component.custom_id) continue;
      } else if (isRegExp(customId)) {
        if (!customId.test(component.custom_id)) continue;
      }
    }

    for (let j = 0; j < component.options.length; j++) {
      const option = component.options[j];
      if (option.default) defaultOptions.push(option);
    }
  }

  return defaultOptions;
}

function recursiveGetDefaultOptionsFromAPISelectMenus(
  components: APIMessageComponent[],
  customId?: string | RegExp,
) {
  const defaultOptions: APISelectMenuOption[] = [];

  for (let i = 0; i < components.length; i++) {
    const component = components[i];

    if ("components" in component) {
      const options = recursiveGetDefaultOptionsFromAPISelectMenus(component.components, customId);
      defaultOptions.push(...options);
      continue;
    }

    if (!("options" in component)) continue;

    if (customId) {
      if (typeof customId === "string") {
        if (customId !== component.custom_id) continue;
      } else if (isRegExp(customId)) {
        if (!customId.test(component.custom_id)) continue;
      }
    }

    for (let j = 0; j < component.options.length; j++) {
      const option = component.options[j];
      if (option.default) defaultOptions.push(option);
    }
  }

  return defaultOptions;
}

export function getDefaultValuesFromSelectMenus<D extends SelectMenuDefaultValueType>(
  components: JSONEncodable<APIMessageComponent>[],
  callback: (selectMenu: APISelectMenuComponent, rowIndex: number) => boolean,
): APISelectMenuDefaultValue<D>[]
export function getDefaultValuesFromSelectMenus<D extends SelectMenuDefaultValueType>(
  components: JSONEncodable<APIMessageComponent>[],
  customId?: string | RegExp,
): APISelectMenuDefaultValue<D>[]
export function getDefaultValuesFromSelectMenus(
  components: JSONEncodable<APIMessageComponent>[],
  customId?: any,
) {
  if (!Array.isArray(components)) throw TypeError("components is not a array");

  if (typeof customId === "function") return getDefaultValuesFromSelectMenuWithCallback(components, customId);

  const defaultValues: any[] = [];

  for (let i = 0; i < components.length; i++) {
    const component = components[i].toJSON();

    if ("components" in component) {
      const values = recursiveGetDefaultValuesFromAPISelectMenus(component.components, customId);

      defaultValues.push(...values);

      continue;
    }

    if (!("default_values" in component) || !Array.isArray(component.default_values)) continue;

    if (customId) {
      if (typeof customId === "string") {
        if (customId === component.custom_id)
          defaultValues.push(...component.default_values);
        continue;
      }

      if (isRegExp(customId)) {
        if (customId.test(component.custom_id))
          defaultValues.push(...component.default_values);
        continue;
      }

      continue;
    }

    defaultValues.push(...component.default_values);
  }

  return defaultValues;
}

function recursiveGetDefaultValuesFromAPISelectMenus(
  components: APIMessageComponent[],
  customId?: string | RegExp,
) {
  const defaultValues: any[] = [];

  for (let i = 0; i < components.length; i++) {
    const component = components[i];

    if ("components" in component) {
      const values = recursiveGetDefaultValuesFromAPISelectMenus(component.components, customId);

      defaultValues.push(...values);

      continue;
    }

    if (!("default_values" in component) || !Array.isArray(component.default_values)) continue;

    if (customId) {
      if (typeof customId === "string") {
        if (customId === component.custom_id)
          defaultValues.push(...component.default_values);
        continue;
      }

      if (isRegExp(customId)) {
        if (customId.test(component.custom_id))
          defaultValues.push(...component.default_values);
        continue;
      }

      continue;
    }

    defaultValues.push(...component.default_values);
  }

  return defaultValues;
}

function getDefaultValuesFromSelectMenuWithCallback(
  components: JSONEncodable<APIMessageComponent>[],
  callback: (selectMenu: any, rowIndex: number) => boolean,
) {
  if (!Array.isArray(components)) throw TypeError("components is not a array");
  if (typeof callback !== "function") throw TypeError("callback is not a function");

  const defaultValues: any[] = [];

  for (let i = 0; i < components.length; i++) {
    const component = components[i].toJSON();

    if ("components" in component) {
      const values = recursiveGetDefaultValuesFromAPISelectMenuWithCallback(component.components, callback);
      defaultValues.push(...values);
      continue;
    }

    if (!("default_values" in component) || !Array.isArray(component.default_values) || !callback(component, i)) continue;

    defaultValues.push(...component.default_values);
  }

  return defaultValues;
}

function recursiveGetDefaultValuesFromAPISelectMenuWithCallback(
  components: APIMessageComponent[],
  callback: (selectMenu: any, rowIndex: number) => boolean,
) {
  const defaultValues: any[] = [];

  for (let i = 0; i < components.length; i++) {
    const component = components[i];

    if ("components" in component) {
      const values = recursiveGetDefaultValuesFromAPISelectMenuWithCallback(component.components, callback);

      defaultValues.push(...values);

      continue;
    }

    if (!("default_values" in component) || !Array.isArray(component.default_values) || !callback(component, i)) continue;

    defaultValues.push(...component.default_values);
  }

  return defaultValues;
}

/**
 * The sequence of mapping components from priority to sub components
 *
 * How it is received:
 * `action row` -> `sub components`
 *
 * How it is mapped:
 * `sub components` -> `action row`
 * 
 * @param callback - You can `return` the `modified component` or `delete it with null`.
 * @returns A new modified array (the original structure will not be modified)
 * 
 * @example
 * ```ts
 * mapSelectMenus(components, (component, index) => {
 *   // Delete a component
 *   if (component.type !== ComponentType.StringSelect) return null;
 *   // filter components
 *   if (component.placeholder !== "example") return component
 *   // Modify component
 *   component.placeholder = "modified"
 *   // Return modified component
 *   return component;
 * })
 */
export function mapSelectMenus(
  components: (APIMessageComponent | JSONEncodable<APIMessageComponent>)[],
  callback: (menu: APISelectMenuComponent, menuIndex: number)
    => APISelectMenuComponent | JSONEncodable<APISelectMenuComponent> | null,
) {
  return mapComponents(components, (component, index) => {
    if (!selectMenuTypes.has(component.type)) return component;
    return callback(component as APISelectMenuComponent, index);
  });
}

export function mapSelectMenuOptions(
  components: (APIMessageComponent | JSONEncodable<APIMessageComponent>)[],
  callback: (option: APISelectMenuOption, optionIndex: number, menuIndex: number, menu: APIStringSelectComponent)
    => APISelectMenuOption | JSONEncodable<APISelectMenuOption> | null,
) {
  return mapComponents(components, (component, index) => {
    if (!("options" in component)) return component;

    component.options = component.options.reduce<APISelectMenuOption[]>((accOptions, option, optionIndex) => {
      const result = callback(option, optionIndex, index, component);

      if (result) accOptions.push(result as any);

      return accOptions;
    }, []);

    if (!component.options.length) return null;

    component.max_values = typeof component.max_values === "number"
      ? Math.min(component.options.length, component.max_values)
      : undefined;

    component.min_values = typeof component.min_values === "number"
      ? Math.min(component.options.length, component.min_values)
      : undefined;

    return component;
  });
}
