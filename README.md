# discordjs-voicerole

This is a pluggable package for Discord.js applications and bots. It
will add a guild member to a specific role whenever the member joins a
voice channel, and it will remove the member from the role when the
voice channel is left.

## Requirements

A JavaScript project already depending on Discord.js 13 or Discord.js 14.

**Still trapped in Discord.js 12 and having a hard time upgrading?**
👉 Stay using discordjs-voicerole 1.0.1, the last version supporting
Discord.js 12. You can pin it in your package.json like this:

    "discordjs-voicerole": "<2.0.0"

Sorry for stating this, but consider upgrading your bot.

## How to use

Import the VoiceRoleManager to use it.

If you are using Node.js and CommonJS. (You probably are if you don't
know):

```js
const { VoiceRoleManager } = require("discordjs-voicerole");
```

If you are using ES Modules or TypeScript, you can make use of import:

```js
import { VoiceRoleManager } from "discordjs-voicerole";
```

Build a VoiceRoleManager. You need to provide a configuration object.
It is an object where keys are the snowflake of a voice channel.
For each key, assign the string of the snowflake of a role to the
array of snowflakes of roles.

When the user joins a channel monitored by the VoiceRoleManager, they
will receive all the roles pointed by their entry in the configuration,
and when they leave the channel, they will have those roles removed.

* To get the ID of a voice channel, right click the channel and use
  "Copy ID". Make sure that Developer Mode is turned on in the Advanced
  Settings.
* To get the ID of a role, visit the server role settings, right click
  the role, and use "Copy ID". Make sure that Developer Mode is turned
  on in the Advanced Settings.

```js
const manager = new VoiceRoleManager({
  "40001": ["20001", "20002"],
  "50001": "30001",
};

// When the user joins the voice channel with ID 40001, the roles with
// the ID 20001 and 20002 will be user, and removed when the channel
// is left. When the user joins the voice channel with ID 50001, the
// role with ID 30001 is assigned to the user and removed when left.
```

To make the library work, simply handle the `voiceStateUpdate` event
in your Discord.js application and call the `trigger` function with
both `VoiceState` objects.

```js
// client may be Discord.js Client, a Commando CommandoClient...
client.on('voiceStateUpdate', (old, cur) => manager.trigger(old, cur));
```

## Copyright and license

[ISC License](https://opensource.org/licenses/ISC). Happy to hear about
cool projects using this library.

```
Copyright 2021-2022 Dani Rodríguez

Permission to use, copy, modify, and/or distribute this software for
any purpose with or without fee is hereby granted, provided that the
above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL
WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES
OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE
FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY
DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER
IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING
OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```
