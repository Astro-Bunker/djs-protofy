import { Client, Events } from "discord.js";
import type { AwaitOptions } from "../@types";

export default class ClientExtension<Ready extends boolean = boolean> {
  declare isReady: Client<Ready>["isReady"];
  declare off: Client<Ready>["off"];
  declare once: Client<Ready>["once"];

  constructor() {
    Object.defineProperties(Client.prototype, {
      awaitReady: { value: this.awaitReady },
    });
  }

  /** @DJSProtofy */
  awaitReady(): Promise<Ready>;
  awaitReady(options: AwaitOptions): Promise<Ready>;
  async awaitReady(options?: AwaitOptions) {
    if (this.isReady()) return true;
    return await new Promise(r => {
      let timeout: NodeJS.Timeout;
      const onReady = (client?: Client) => {
        clearTimeout(timeout);
        this.off(Events.ClientReady, onReady);
        r(Boolean(client));
      };
      this.once(Events.ClientReady, onReady);
      if (this.isReady()) return onReady(this);
      if (options?.time) timeout = setTimeout(onReady, options.time);
    });
  }
}
