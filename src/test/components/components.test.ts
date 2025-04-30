import assert from "assert";
import { ActionRowBuilder, type BaseMessageOptions, ButtonBuilder, ComponentType, UserSelectMenuBuilder } from "discord.js";
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
      /** Removing a component by type */
      if (component.type === ComponentType.UserSelect) return null;

      /** Skip non matched components */
      if (component.type !== ComponentType.Button) return component;

      /** Remove non matched buttons */
      if (!("custom_id" in component)) return null;

      /** Editing matched buttons */
      if (component.custom_id === "buttonId") {
        component.label = "edited";

        return component;
      }

      /** Remove another buttons */
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

  test("Mapping sequence components", () => {
    const expected = getComponentsSequence(components);

    const actual: number[] = [];

    const _components: BaseMessageOptions["components"] = mapComponents(components, (component) => {
      actual.push(component.type);
      return component;
    });

    assert.deepStrictEqual(actual, expected);
  });

  function getComponentsSequence(components: any[]) {
    return components.reduce<number[]>((acc, cur) => {
      const json = cur.toJSON();

      if (cur.components)
        acc.push(...getComponentsSequence(cur.components));

      acc.push(json.type);

      return acc;
    }, []);
  }
});
