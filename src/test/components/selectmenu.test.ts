import assert from "assert";
import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, UserSelectMenuBuilder } from "discord.js";
import test, { describe } from "node:test";
import { getDefaultOptionsFromSelectMenus, mapSelectMenuOptions, mapSelectMenus } from "../../components";

describe("Testing mapping select menus", () => {
  const components = Array.from({ length: 5 }).map((_, i) => new ActionRowBuilder<UserSelectMenuBuilder>({
    components: [
      new UserSelectMenuBuilder({
        custom_id: "userSelectMenuId" + i,
      }),
    ],
  }));

  test("Mapping select menus", () => {
    const actual = mapSelectMenus(components, (selectmenu) => {
      if (selectmenu.custom_id === "userSelectMenuId2") {
        selectmenu.placeholder = "edited";
        return selectmenu;
      }

      return null;
    });

    const expected = [
      new ActionRowBuilder<UserSelectMenuBuilder>({
        components: [
          new UserSelectMenuBuilder({
            custom_id: "userSelectMenuId2",
            placeholder: "edited",
          }),
        ],
      }),
    ];

    assert.deepStrictEqual(actual.map(r => r.toJSON()), expected.map(r => r.toJSON()));
  });
});

describe("Testing mapping select menu options", () => {
  test("Mapping select menu options", () => {
    const components = [
      new ActionRowBuilder<StringSelectMenuBuilder>({
        components: [
          new StringSelectMenuBuilder({
            custom_id: "stringSelectMenuId",
            options: Array.from({ length: 25 }).map((_, i) => ({
              label: "label" + i,
              value: "value" + i,
            })),
          }),
        ],
      }),
    ];

    const actual = mapSelectMenuOptions(components, (option) => {
      if (option.value === "value20") {
        option.label = "edited";
        return option;
      }

      return null;
    });

    const expected = [
      new ActionRowBuilder<StringSelectMenuBuilder>({
        components: [
          new StringSelectMenuBuilder({
            custom_id: "stringSelectMenuId",
            max_values: undefined,
            min_values: undefined,
            options: [{
              label: "edited",
              value: "value20",
            }],
          }),
        ],
      }),
    ];

    assert.deepStrictEqual(actual.map(r => r.toJSON()), expected.map(r => r.toJSON()));
  });

  test("Mapping select menu options with max_values=25", () => {
    const components = [
      new ActionRowBuilder<StringSelectMenuBuilder>({
        components: [
          new StringSelectMenuBuilder({
            custom_id: "stringSelectMenuId",
            options: Array.from({ length: 25 }).map((_, i) => ({
              label: "label" + i,
              value: "value" + i,
            })),
            max_values: 25,
            min_values: 25,
          }),
        ],
      }),
    ];

    const actual = mapSelectMenuOptions(components, (option) => {
      if (option.value === "value20") {
        option.label = "edited";
        return option;
      }

      return null;
    });

    const expected = [
      new ActionRowBuilder<StringSelectMenuBuilder>({
        components: [
          new StringSelectMenuBuilder({
            custom_id: "stringSelectMenuId",
            max_values: 1,
            min_values: 1,
            options: [{
              label: "edited",
              value: "value20",
            }],
          }),
        ],
      }),
    ];

    assert.deepStrictEqual(actual.map(r => r.toJSON()), expected.map(r => r.toJSON()));
  });
});

describe("Testing getting default select menu options", () => {
  const components = [
    new ActionRowBuilder<StringSelectMenuBuilder>({
      components: [
        new StringSelectMenuBuilder({
          custom_id: "stringSelectMenuId",
          options: Array.from({ length: 25 }).map((_, i) => ({
            label: "label" + i,
            value: "value" + i,
            default: i === 10,
          })),
        }),
      ],
    }),
  ];

  test("Getting default select menu option", () => {
    const actual = getDefaultOptionsFromSelectMenus(components);

    const expected = [
      new StringSelectMenuOptionBuilder({
        label: "label10",
        value: "value10",
        default: true,
      }).toJSON(),
    ];

    assert.deepStrictEqual(actual, expected);
  });
});
