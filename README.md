# 📃 djs-easier

A library created to make Discord.JS easier to use through prototypes.

## Installation

```sh
npm i djs-easier
yarn add djs-easier
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

## Supported Prototypes

```js
// Client
<Client>.channels
<Client>.emojis
<Client>.guilds
<Client>.users

// Guild
<Guild>.channels
<Guild>.emojis
<Guild>.members
<Guild>.roles
<GuildTextChannel>.messages
```
