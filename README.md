# 📃 djs-protofy

A library created to make discord.js easier to use through prototypes.

[![djs-protofy](https://img.shields.io/npm/v/djs-protofy?style=for-the-badge&label=djs-protofy)](https://www.npmjs.com/package/djs-protofy)
[![Supported DJS Version](https://img.shields.io/github/package-json/dependency-version/Saphire-Bunker/djs-easier/dev/discord.js?style=for-the-badge)](https://github.com/discordjs/discord.js)

## Links

- [Discord Server](https://discord.gg/FqnRDbJwYT)
- [Github](https://github.com/Saphire-Bunker/djs-easier/tree/main)
- [NPM](https://www.npmjs.com/package/djs-protofy)

## Requirements

- [discord.js](https://github.com/discordjs/discord.js) version 14 or above

## Installation

```sh
npm i djs-protofy
yarn add djs-protofy
pnpm i djs-protofy
```

## How to use

Import `djs-protofy/init` into the main file.

```js
// ES5
require("djs-protofy/init");

// ES6
import "djs-protofy/init";
```

## Examples

Getting a user

```js
client.users.cache.get(string); // Instead of
client.users.getById(string); // Do it
```

Getting a voice channel by a user

```js
// Instead of
client.channels.cache.find((channel) => {
  if (!channel.isVoiceBased()) return false;
  return channel.members.has(string);
});

// Do it
client.channels.getVoiceByUserId(string);
```
