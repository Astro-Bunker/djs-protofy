import assert from "assert";
import { Client, Events, Status } from "discord.js";
import test, { describe } from "node:test";
import ClientExtension from "../../prototypes/Client";

new ClientExtension();

describe("Testing Client#awaitReady", () => {
  const client = new Client({ intents: 0 });

  test("Client#awaitReady", async () => {
    const off = await client.awaitReady({ time: 1 });
    assert(!off);

    const on = client.awaitReady();
    client.emit(Events.ClientReady, client as Client<true>);
    assert(await on);

    client.ws.status = Status.Ready;

    assert(await client.awaitReady());
  });
});
