import { createComponentBuilder, isJSONEncodable, type APIMessageComponent, type APIModalComponent, type JSONEncodable } from "discord.js";

export function mapComponents<T extends APIModalComponent | APIMessageComponent>(
  components: (T | JSONEncodable<T>)[],
  callback: (component: T, componentIndex: number) => T | JSONEncodable<T> | null,
): (T | JSONEncodable<T>)[] {
  if (!Array.isArray(components)) throw TypeError("components is not a array");
  if (typeof callback !== "function") throw TypeError("callback is not a function");

  return components.reduce<(T | JSONEncodable<T>)[]>((accComponents, component, componentIndex) => {
    const componentJSON = isJSONEncodable(component) ? component.toJSON() : component;

    if ("components" in componentJSON) {
      componentJSON.components = mapComponents<any>(componentJSON.components, callback);
      if (componentJSON.components.length) accComponents.push(createComponentBuilder<any>(componentJSON));
      return accComponents;
    }

    const result = callback(componentJSON, componentIndex);

    if (result) accComponents.push(result as T);

    return accComponents;
  }, []);
}
