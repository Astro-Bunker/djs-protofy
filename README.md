# 📃 djs-easier

Uma biblioteca criada para facilitar o uso do Discord.JS por meio dos protoypes

## Instalação do djs-easier

```sh
npm i djs-easier
yarn add djs-easier
```

## Como usar

```js
// ES5
require("djs-easier/init");

// ES6
import "djs-easier/init";

/**
 * Observação importante
 * Importe o djs-easier apenas no arquivo principal do bot
 */
```

## Exemplos de uso

Buscando um usuário

```js
client.users.cache.get("userId");  // Ao invés disso...
client.users.getById("userId"); // Faça isso
```

Buscando um canal de voz por um usuário

```js
// Ao invés disso...
client.channels.cache.find((channel) => {
  if (!channel.isVoiceBased()) return false;
  return channel.members.has(userId);
});

// Faça isso
client.channels.getVoiceByUserId(userId);
```

## Prototypes suportados

```js
// Client
client.channels
client.emojis
client.users
client.guilds

// Guild
guild.channels
guild.emojis
guild.members
guild.roles
<TextGuildChannel>.messages
```
