import { createComponentBuilder, isJSONEncodable, type APIMessageComponent, type APIModalComponent, type JSONEncodable } from "discord.js";

export function mapComponents<T extends APIModalComponent | APIMessageComponent>(
  components: (T | JSONEncodable<T>)[],
  callback: (component: T, componentIndex: number) => T | JSONEncodable<T> | null,
): JSONEncodable<T>[];
export function mapComponents<
  T extends APIModalComponent | APIMessageComponent,
  U extends APIModalComponent | APIMessageComponent = T,
>(
  components: (T | JSONEncodable<T>)[],
  callback: (component: U, componentIndex: number) => U | JSONEncodable<U> | null,
): JSONEncodable<T & U>[];
export function mapComponents(
  components: (APIModalComponent | APIMessageComponent | JSONEncodable<APIModalComponent | APIMessageComponent>)[],
  callback: (component: APIModalComponent | APIMessageComponent, componentIndex: number) => APIModalComponent | APIMessageComponent | JSONEncodable<APIModalComponent | APIMessageComponent> | null,
): JSONEncodable<APIModalComponent | APIMessageComponent>[];
export function mapComponents(
  components: (APIModalComponent | APIMessageComponent | JSONEncodable<APIModalComponent | APIMessageComponent>)[],
  callback: (component: APIModalComponent | APIMessageComponent, componentIndex: number) => APIModalComponent | APIMessageComponent | JSONEncodable<APIModalComponent | APIMessageComponent> | null,
) {
  if (!Array.isArray(components)) throw TypeError("components is not a array");
  if (typeof callback !== "function") throw TypeError("callback is not a function");

  return components.reduce<JSONEncodable<APIModalComponent | APIMessageComponent>[]>((accComponents, component, componentIndex) => {
    const componentJSON = isJSONEncodable(component) ? component.toJSON() : component;

    if ("components" in componentJSON) {
      componentJSON.components = mapSubComponents<any>(componentJSON.components, callback) as any;
      if (componentJSON.components.length) accComponents.push(createComponentBuilder<any>(componentJSON));
      return accComponents;
    }

    const result = callback(componentJSON, componentIndex);

    if (result) accComponents.push(createComponentBuilder<any>(result));

    return accComponents;
  }, []);
}

function mapSubComponents<T extends APIModalComponent | APIMessageComponent>(
  components: (T | JSONEncodable<T>)[],
  callback: (component: T, componentIndex: number) => T | JSONEncodable<T> | null,
) {
  return components.reduce<T[]>((accComponents, component, componentIndex) => {
    const componentJSON = isJSONEncodable(component) ? component.toJSON() : component;

    if ("components" in componentJSON) {
      componentJSON.components = mapSubComponents<any>(componentJSON.components, callback);
      if (componentJSON.components.length) accComponents.push(componentJSON as T);
      return accComponents;
    }

    const result = callback(componentJSON as T, componentIndex);

    if (result) accComponents.push(result as T);

    return accComponents;
  }, []);
}
