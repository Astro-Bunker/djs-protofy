import assert from "assert";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import test, { describe } from "node:test";
import { mapButtons } from "../../components";

describe("Testing mapping buttons", () => {
  const components = [
    new ActionRowBuilder<ButtonBuilder>({
      components: Array.from({ length: 5 }).map((_, i) => new ButtonBuilder({
        custom_id: "customId" + i,
        label: "label" + i,
        style: ButtonStyle.Primary,
      })),
    }),
  ];

  test("Mapping buttons", () => {
    const actual = mapButtons(components, (button) => {
      /** Skip non matched buttons */
      if (button.style === ButtonStyle.Link) return button;

      /** Editing matched buttons */
      if (button.custom_id === "customId1") {
        button.label = "edited";
        button.style = ButtonStyle.Secondary;
        return button;
      }

      /** Removing another buttons */
      return null;
    });

    const expected = [
      new ActionRowBuilder<ButtonBuilder>({
        components: [
          new ButtonBuilder({
            custom_id: "customId1",
            label: "edited",
            style: ButtonStyle.Secondary,
          }),
        ],
      }),
    ];

    assert.deepStrictEqual(actual, expected);
  });
});
