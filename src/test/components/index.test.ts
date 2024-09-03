import assert from "assert";
import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, UserSelectMenuBuilder } from "discord.js";
import test, { describe } from "node:test";
import { mapComponents } from "../../components";

describe("Testing mapping components", () => {
  const components = [
    new ActionRowBuilder<ButtonBuilder>({
      components: [
        new ButtonBuilder({
          custom_id: "buttonId",
          label: "buttonLabel",
        }),
      ],
    }),
    new ActionRowBuilder<UserSelectMenuBuilder>({
      components: [
        new UserSelectMenuBuilder({
          custom_id: "userSelectMenuId",
        }),
      ],
    }),
  ];

  test("Mapping components", () => {
    const actual = mapComponents(components, (component) => {
      /** Remove non matched components */
      if (component.type !== ComponentType.Button) return null;

      /** Remove non matched components */
      if (!("custom_id" in component)) return null;

      /** Editing matched components */
      if (component.custom_id === "buttonId") {
        component.label = "edited";

        return component;
      }

      /** Remove another components */
      return null;
    });

    const expected = [
      new ActionRowBuilder<ButtonBuilder>({
        components: [
          new ButtonBuilder({
            custom_id: "buttonId",
            label: "edited",
          }),
        ],
      }),
    ];

    assert.deepStrictEqual(actual.map(r => r.toJSON()), expected.map(r => r.toJSON()));
  });
});
