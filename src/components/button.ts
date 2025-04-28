import { type APIButtonComponent, type APIMessageComponent, ComponentType, createComponentBuilder, type JSONEncodable } from "discord.js";

export function mapButtons<T extends JSONEncodable<APIMessageComponent>>(
  components: T[],
  callback: (button: APIButtonComponent, rowIndex: number, buttonIndex: number)
    => APIButtonComponent | JSONEncodable<APIButtonComponent> | null,
) {
  if (!Array.isArray(components)) throw TypeError("components is not a array");
  if (typeof callback !== "function") throw TypeError("callback is not a function");

  return components.reduce<T[]>((accComponents, component, componentIndex) => {
    const componentJSON = component.toJSON();

    if (!("components" in componentJSON)) return accComponents;
    if (!componentJSON.components.length) return accComponents;

    componentJSON.components = recursiveMapAPIButtons<any>(componentJSON.components, componentIndex, callback);

    if (componentJSON.components.length) accComponents.push(createComponentBuilder<any>(componentJSON));

    return accComponents;
  }, []);
}

function recursiveMapAPIButtons<T extends APIMessageComponent>(
  components: T[],
  rowIndex: number,
  callback: (button: APIButtonComponent, rowIndex: number, buttonIndex: number)
    => APIButtonComponent | JSONEncodable<APIButtonComponent> | null,
): T[] {
  return components.reduce<T[]>((accComponents, component, componentIndex) => {
    if ("components" in component) {
      component.components = recursiveMapAPIButtons<any>(component.components, componentIndex, callback);

      if (component.components.length) accComponents.push(component);

      return accComponents;
    }

    if (component.type !== ComponentType.Button) return accComponents;

    const result = callback(component, rowIndex, componentIndex);

    if (result) accComponents.push(result as T);

    return accComponents;
  }, []);
}
