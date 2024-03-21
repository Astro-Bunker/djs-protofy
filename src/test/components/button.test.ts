import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import assert from "node:assert";
import test, { describe } from "node:test";
import { mapButtons } from "../../components";

describe("Testing mapping buttons", () => {
  const BUTTONS = [
    new ActionRowBuilder<ButtonBuilder>({
      components: Array.from(Array(5)).map((_, i) => new ButtonBuilder({
        custom_id: "customId" + i,
        label: "label" + i,
        style: ButtonStyle.Primary,
      })),
    }),
  ];

  test("Mapping buttons", () => {
    const actual = mapButtons(BUTTONS, (button) => {
      if (button.style === ButtonStyle.Link) return button;
      if (button.custom_id === "customId1") {
        button.label = "edit";
        button.style = ButtonStyle.Secondary;
        return button;
      }
      return null;
    });

    const expected = [
      new ActionRowBuilder<ButtonBuilder>({
        components: [
          new ButtonBuilder({
            custom_id: "customId1",
            label: "edit",
            style: ButtonStyle.Secondary,
          }),
        ],
      }),
    ];

    assert.deepStrictEqual(actual, expected);
  });
});
