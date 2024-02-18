# 📃 djs-easier

[![Supported DJS Version](https://img.shields.io/github/package-json/dependency-version/Saphire-Bunker/djs-easier/dev/discord.js?style=for-the-badge)](https://github.com/discordjs/discord.js)

A library created to make Discord.JS easier to use through prototypes.

## Requirements

- [discord.js](https://github.com/discordjs/discord.js) version 14 or above

## Installation

```sh
npm i djs-protofy
yarn add djs-protofy
pnpm i djs-protofy
```

## How to use

Import `djs-easier/init` into the main file.

```js
// ES5
require("djs-easier/init");

// ES6
import "djs-easier/init";
```

## Examples

Getting a user

```js
client.users.cache.get("userId"); // Instead of
client.users.getById("userId"); // Do it
```

Getting a voice channel by a user

```js
// Instead of
client.channels.cache.find((channel) => {
  if (!channel.isVoiceBased()) return false;
  return channel.members.has(userId);
});

// Do it
client.channels.getVoiceByUserId(userId);
```

## Supported prototypes

```js
<Client>.channels
<Client>.emojis
<Client>.guilds
<Client>.users

<Guild>.channels
<Guild>.emojis
<Guild>.members
<Guild>.roles
<GuildTextChannel>.messages
```
