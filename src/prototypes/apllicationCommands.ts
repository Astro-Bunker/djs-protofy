import { Client, Collection, ApplicationCommand, ApplicationCommandManager } from "discord.js";

export class ApplicationCommands {
  declare cache: Collection<string, ApplicationCommand>;
  declare client: Client<true>;

  constructor() {
    Object.defineProperties(ApplicationCommandManager.prototype, {
    });

    this.client.once("ready", async () => {
      if (!this.client.application) return;
      await this.client.application.commands.fetch().catch(() => { });
    });
  }

}
