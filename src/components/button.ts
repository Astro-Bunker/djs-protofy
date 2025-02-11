import { ActionRowBuilder, ButtonBuilder, ComponentType, type APIButtonComponent, type ActionRow, type MessageActionRowComponent, type MessageActionRowComponentBuilder } from "discord.js";

export function mapButtons<
  T extends ActionRow<MessageActionRowComponent> | ActionRowBuilder<MessageActionRowComponentBuilder>
>(
  components: T[],
  callback: (button: APIButtonComponent, rowIndex: number, buttonIndex: number) => APIButtonComponent | ButtonBuilder | null,
) {
  if (!Array.isArray(components)) throw TypeError("components is not a array");
  if (typeof callback !== "function") throw TypeError("callback is not a function");

  return components.reduce<T[]>((accRows, row, rowIndex) => {
    const rowJson = row.toJSON();

    if (!rowJson.components.length) return accRows;
    if (rowJson.components[0].type !== ComponentType.Button) return accRows.concat(row);

    const buttons = rowJson.components.reduce<ButtonBuilder[]>((accButtons, button, buttonIndex) => {
      const result = callback(button as APIButtonComponent, rowIndex, buttonIndex);
      if (result) return accButtons.concat(ButtonBuilder.from(result));
      return accButtons;
    }, []);

    if (buttons.length) return accRows.concat(new ActionRowBuilder<ButtonBuilder>().addComponents(buttons) as T);

    return accRows;
  }, []);
}
