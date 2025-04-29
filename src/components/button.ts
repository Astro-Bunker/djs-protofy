import { type APIMessageComponent, ComponentType, type JSONEncodable } from "discord.js";
import { mapComponents } from "./components";

export function mapButtons<T extends APIMessageComponent>(
  components: (T | JSONEncodable<T>)[],
  callback: (button: T, buttonIndex: number) => T | JSONEncodable<T> | null,
) {
  return mapComponents(components, (component, index) => {
    if (component.type !== ComponentType.Button) return component;
    return callback(component, index);
  });
}
