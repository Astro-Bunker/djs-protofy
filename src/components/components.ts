import { createComponentBuilder, isJSONEncodable, type APIMessageComponent, type APIModalComponent, type JSONEncodable } from "discord.js";

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
 * mapComponents(components, (component, index) => {
 *   // Skip non matched components
 *   if (component.type !== ComponentType.Button) return component;
 *   // Delete a component
 *   if (component.style !== ButtonStyle.Link) return null;
 *   // filter components
 *   if (component.label !== "example") return component
 *   // Modify component
 *   component.label = "modified"
 *   // Return modified component
 *   return component;
 * });
 */
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

export function mapComponents<T extends APIModalComponent | APIMessageComponent>(
  components: (T | JSONEncodable<T>)[],
  callback: <U extends APIModalComponent | APIMessageComponent = T>
    (component: U, componentIndex: number) => U | JSONEncodable<U> | null,
): JSONEncodable<T>[];

export function mapComponents(
  components: (APIModalComponent | APIMessageComponent | JSONEncodable<APIModalComponent | APIMessageComponent>)[],
  callback: (component: APIModalComponent | APIMessageComponent, componentIndex: number)
    => APIModalComponent | APIMessageComponent | JSONEncodable<APIModalComponent | APIMessageComponent> | null,
): JSONEncodable<APIModalComponent | APIMessageComponent>[];

export function mapComponents<T extends APIModalComponent | APIMessageComponent>(
  components: (T | JSONEncodable<T>)[],
  callback: (component: T, componentIndex: number) => T | JSONEncodable<T> | null,
) {
  if (!Array.isArray(components)) throw TypeError("components is not a array");
  if (typeof callback !== "function") throw TypeError("callback is not a function");

  return components.reduce<JSONEncodable<T>[]>((accComponents, component, componentIndex) => {
    const componentJSON = isJSONEncodable(component) ? component.toJSON() : component;

    if ("components" in componentJSON) {
      componentJSON.components = mapSubComponents<any>(componentJSON.components, componentIndex, callback);
      if (!componentJSON.components.length) return accComponents;
    }

    const result = callback(componentJSON, componentIndex);

    if (result) accComponents.push(createComponentBuilder<any>(result));

    return accComponents;
  }, []);
}

function mapSubComponents<T extends APIModalComponent | APIMessageComponent>(
  components: T[],
  rowIndex: number,
  callback: (component: T, componentIndex: number, rowIndex: number) => T | JSONEncodable<T> | null,
) {
  return components.reduce<T[]>((accComponents, component, componentIndex) => {
    if ("components" in component) {
      component.components = mapSubComponents<any>(component.components, componentIndex, callback);
      if (!component.components.length) return accComponents;
    }

    const result = callback(component, componentIndex, rowIndex);

    if (result) accComponents.push(result as T);

    return accComponents;
  }, []);
}
