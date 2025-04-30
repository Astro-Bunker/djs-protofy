import { type APIButtonComponent, type APIMessageComponent, ComponentType, type JSONEncodable } from "discord.js";
import { mapComponents } from "./components";

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
 * mapButtons(components, (component, index) => {
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
export function mapButtons<T extends APIMessageComponent, U extends APIButtonComponent = APIButtonComponent>(
  components: (APIMessageComponent | JSONEncodable<APIMessageComponent>)[],
  callback: (button: U, buttonIndex: number) => U | JSONEncodable<U> | null,
): JSONEncodable<T>[];

export function mapButtons(
  components: (APIMessageComponent | JSONEncodable<APIMessageComponent>)[],
  callback: (button: APIButtonComponent, buttonIndex: number)
    => APIMessageComponent | JSONEncodable<APIMessageComponent> | null,
) {
  return mapComponents(components, (component, index) => {
    if (component.type !== ComponentType.Button) return component;
    return callback(component, index);
  });
}
