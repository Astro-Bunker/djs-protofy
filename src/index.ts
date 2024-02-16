import { Client } from "discord.js";
import Channels from "./channels";

export class DJSProto {
    constructor(protected client: Client) {
        new Channels(client);
    }
}