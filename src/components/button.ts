import { ActionRowBuilder, ButtonBuilder, ComponentType, type APIActionRowComponent, type APIButtonComponent, type APIMessageActionRowComponent, type ActionRow, type MessageActionRowComponent, type MessageActionRowComponentBuilder } from "discord.js";
import { exists } from "../utils";

export function mapButtons<
  T extends ActionRow<MessageActionRowComponent> | ActionRowBuilder<MessageActionRowComponentBuilder>
>(
  components: T[],
  callback: (button: APIButtonComponent, rowIndex: number, buttonIndex: number) => APIButtonComponent | ButtonBuilder | null,
) {
  if (!Array.isArray(components)) throw Error("components is not a array");
  if (typeof callback !== "function") throw Error("callback is not a function");

  return components.reduce<T[]>((accRows, row, rowIndex) => {
    const rowJson = row.toJSON() as APIActionRowComponent<APIMessageActionRowComponent>;

    if (rowJson.components[0]?.type !== ComponentType.Button) return accRows.concat(row);

    const buttons = rowJson.components.reduce<ButtonBuilder[]>((accButtons, button, buttonIndex) => {
      const result = callback(button as APIButtonComponent, rowIndex, buttonIndex);
      if (exists(result)) return accButtons.concat(ButtonBuilder.from(result));
      return accButtons;
    }, []);

    if (buttons.length) return accRows.concat(new ActionRowBuilder<ButtonBuilder>().addComponents(buttons) as T);

    return accRows;
  }, []);
}
