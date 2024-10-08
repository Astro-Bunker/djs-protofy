import { ActionRowBuilder, createComponentBuilder, type APIActionRowComponent, type APIActionRowComponentTypes, type ActionRow, type AnyComponentBuilder, type MessageActionRowComponent, type ModalActionRowComponent } from "discord.js";
import { exists } from "../utils";

export * from "./button";
export * from "./selectmenu";

export function mapComponents<
  T extends ActionRow<MessageActionRowComponent | ModalActionRowComponent> | ActionRowBuilder<AnyComponentBuilder>
>(
  components: T[],
  callback: (component: APIActionRowComponentTypes, rowIndex: number, columnIndex: number) =>
    APIActionRowComponentTypes | AnyComponentBuilder | null,
) {
  if (!Array.isArray(components)) throw Error("components is not a array");
  if (typeof callback !== "function") throw Error("callback is not a function");

  return components.reduce<T[]>((accRows, row, rowIndex) => {
    const rowJson = row.toJSON() as APIActionRowComponent<APIActionRowComponentTypes>;

    const columns = rowJson.components.reduce<AnyComponentBuilder[]>((accColumns, column, columnIndex) => {
      const result = callback(column, rowIndex, columnIndex);
      // @ts-expect-error ts(2769)
      if (exists(result)) return accColumns.concat(createComponentBuilder(result));
      return accColumns;
    }, []);

    if (columns.length) return accRows.concat(new ActionRowBuilder().addComponents(columns) as T);

    return accRows;
  }, []);
}
