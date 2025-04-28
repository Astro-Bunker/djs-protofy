import { createComponentBuilder, type AnyComponentBuilder, type APIMessageComponent, type APIModalComponent, type JSONEncodable } from "discord.js";

export function mapComponents<T extends JSONEncodable<APIModalComponent | APIMessageComponent>>(
  components: T[],
  callback: (component: APIModalComponent | APIMessageComponent, rowIndex: number, columnIndex: number) =>
    APIModalComponent | APIMessageComponent | AnyComponentBuilder | null,
) {
  if (!Array.isArray(components)) throw TypeError("components is not a array");
  if (typeof callback !== "function") throw TypeError("callback is not a function");

  return components.reduce<T[]>((accComponents, component, componentIndex) => {
    const componentJSON = component.toJSON();

    if (!("components" in componentJSON)) return accComponents;
    if (!componentJSON.components.length) return accComponents;

    componentJSON.components = recursiveMapAPIComponents<any>(componentJSON.components, componentIndex, callback);

    if (componentJSON.components.length) return accComponents.concat(createComponentBuilder<any>(componentJSON));

    return accComponents;
  }, []);
}

function recursiveMapAPIComponents<T extends APIModalComponent | APIMessageComponent>(
  components: T[],
  rowIndex: number,
  callback: (button: T, rowIndex: number, buttonIndex: number) => T | JSONEncodable<T> | null,
): T[] {
  return components.reduce<T[]>((accComponent, component, componentIndex) => {
    if ("components" in component) {
      component.components = recursiveMapAPIComponents<any>(component.components, componentIndex, callback);

      if (component.components.length) accComponent.push(component);

      return accComponent;
    }

    const result = callback(component, rowIndex, componentIndex);

    if (result) accComponent.push(result as T);

    return accComponent;
  }, []);
}
