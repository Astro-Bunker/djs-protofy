import { type APIButtonComponent, type APIMessageComponent, ComponentType, type JSONEncodable } from "discord.js";
import { mapComponents } from "./components";

export function mapButtons(
  components: (APIMessageComponent | JSONEncodable<APIMessageComponent>)[],
  callback: (button: APIButtonComponent, buttonIndex: number) => APIMessageComponent | JSONEncodable<APIMessageComponent> | null,
) {
  return mapComponents(components, (component, index) => {
    if (component.type !== ComponentType.Button) return component;
    return callback(component, index);
  });
}
