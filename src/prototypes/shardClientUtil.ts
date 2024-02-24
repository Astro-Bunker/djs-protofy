import { ShardClientUtil } from "discord.js";

export class SShardClientUtil {
  declare id: ShardClientUtil["ids"][number];
  declare ids: ShardClientUtil["ids"];

  constructor() {
    Object.defineProperties(ShardClientUtil.prototype, {
      id: { get() { return this.ids[0]; } },
    });
  }
}
