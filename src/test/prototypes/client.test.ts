import assert from "assert";
import { Client, Events } from "discord.js";
import test, { describe } from "node:test";
import { SClient } from "../../prototypes/client";

new SClient();

describe("Testing Client#awaitReady", () => {
  const client = new Client({ intents: 0 });

  test("Client#awaitReady", async () => {
    const off = await client.awaitReady({ time: 1 });
    assert(!off);

    const on = client.awaitReady();
    client.emit(Events.ClientReady, client as Client<true>);
    assert(await on);
  });
});
