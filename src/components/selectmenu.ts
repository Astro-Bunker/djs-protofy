import { type APIMessageComponent, type APISelectMenuComponent, type APISelectMenuDefaultValue, type APISelectMenuOption, type APIStringSelectComponent, ComponentType, type JSONEncodable, type SelectMenuDefaultValueType, createComponentBuilder } from "discord.js";
import { isRegExp } from "util/types";

const selectMenuTypes = new Set([
  ComponentType.StringSelect,
  ComponentType.UserSelect,
  ComponentType.RoleSelect,
  ComponentType.MentionableSelect,
  ComponentType.ChannelSelect,
]);

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

export function mapSelectMenus<T extends JSONEncodable<APIMessageComponent>>(
  components: T[],
  callback: (selectMenu: APISelectMenuComponent, rowIndex: number) =>
    APISelectMenuComponent | JSONEncodable<APISelectMenuComponent> | null,
) {
  if (!Array.isArray(components)) throw TypeError("components is not a array");
  if (typeof callback !== "function") throw TypeError("callback is not a function");

  return components.reduce<T[]>((accComponents, row, _rowIndex) => {
    const componentJSON = row.toJSON();

    if (!("components" in componentJSON)) return accComponents;
    if (!componentJSON.components.length) return accComponents;

    componentJSON.components = recursiveMapAPISelectMenus<any>(componentJSON.components, callback);

    if (componentJSON.components.length) accComponents.push(createComponentBuilder<any>(componentJSON));

    return accComponents;
  }, []);
}

function recursiveMapAPISelectMenus<T extends APIMessageComponent>(
  components: T[],
  callback: (selectMenu: APISelectMenuComponent, rowIndex: number) =>
    APISelectMenuComponent | JSONEncodable<APISelectMenuComponent> | null,
): T[] {
  return components.reduce<T[]>((accComponents, component, componentIndex) => {
    if ("components" in component) {
      component.components = recursiveMapAPISelectMenus<any>(component.components as T[], callback);

      if (component.components.length) accComponents.push(component);

      return accComponents;
    }

    if (!selectMenuTypes.has(component.type)) return accComponents;

    const result = callback(component as any, componentIndex);

    if (result) accComponents.push(result as T);

    return accComponents;
  }, []);
}

export function mapSelectMenuOptions<T extends JSONEncodable<APIMessageComponent>>(
  components: T[],
  callback: (option: APISelectMenuOption, rowIndex: number, optionIndex: number, menu: APIStringSelectComponent) =>
    APISelectMenuOption | JSONEncodable<APISelectMenuOption> | null,
) {
  if (!Array.isArray(components)) throw TypeError("components is not a array");
  if (typeof callback !== "function") throw TypeError("callback is not a function");

  return components.reduce<T[]>((accComponents, component, componentIndex) => {
    const componentJSON = component.toJSON();

    if (!("components" in componentJSON)) return accComponents;
    if (!componentJSON.components.length) return accComponents;

    componentJSON.components = recursiveMapAPISelectMenuOptions<any>(componentJSON.components, componentIndex, callback);

    if (componentJSON.components.length) accComponents.push(createComponentBuilder<any>(componentJSON));

    return accComponents;
  }, []);
}

function recursiveMapAPISelectMenuOptions<T extends APIMessageComponent>(
  components: T[],
  rowIndex: number,
  callback: (option: APISelectMenuOption, rowIndex: number, optionIndex: number, menu: APIStringSelectComponent) =>
    APISelectMenuOption | JSONEncodable<APISelectMenuOption> | null,
): T[] {
  return components.reduce<T[]>((accComponents, component, componentIndex) => {
    if ("components" in component) {
      component.components = recursiveMapAPISelectMenuOptions<any>(component.components as T[], componentIndex, callback);

      if (component.components.length) accComponents.push(component);

      return accComponents;
    }

    if (!("options" in component)) return accComponents;
    if (!component.options.length) return accComponents;

    component.options = component.options.reduce<APISelectMenuOption[]>((accOptions, option, optionIndex) => {
      const result = callback(option, rowIndex, optionIndex, component);

      if (result) accOptions.push(result as APISelectMenuOption);

      return accOptions;
    }, []) as any;

    if (component.options.length) {
      component.max_values = typeof component.max_values === "number"
        ? Math.min(component.options.length, component.max_values)
        : undefined;

      component.min_values = typeof component.min_values === "number"
        ? Math.min(component.options.length, component.min_values)
        : undefined;

      accComponents.push(component);
    }

    return accComponents;
  }, []);
}
