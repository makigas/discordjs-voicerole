# discordjs-voicerole

This is a pluggable package for Discord.js applications and bots. It
will add a guild member to a specific role whenever the member joins a
voice channel, and it will remove the member from the role when the
voice channel is left.

## Requirements

A JavaScript project already depending on Discord.js 13.

**Still trapped in Discord.js 12 and having a hard time upgrading?**
👉 Stay using discordjs-voicerole 1.0.1, the last version supporting
Discord.js 12. You can pin it in your package.json like this:

    "discordjs-voicerole": "<2.0.0"

Sorry for stating this, but consider upgrading your bot.

## How to use

This library exposes a single class that depends on Discord.js. It
tries to be agnostic of any other framework (such as Commando). This
way, it should be easy to integrate into your existing bot system.

The constructor expects to be passed an object with the definitions
of the voice channels to monitor. Each key in the object is the
ID of a VoiceChannel. Values assigned to each key are either the
ID of a role, or an array of role IDs.

The expectation is that, for each entry in the object, a member
joining the voice channel whose ID acts as key will add them to
all the roles whose IDs are provided as value. Leaving a voice
channel will remove the previously added roles.

For instance, the following example configures two voice channels,
whose snowflake IDs are 40001 and 40002. The expectation is that
joining the channel whose ID is 40001 will add the user to the
roles 20001 and 20002. Leaving the channel will remove those
roles.

```js
const manager = new VoiceChannelManager({
  "40001": ["20001", "20002"]
};
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
Copyright 2021 Dani Rodríguez

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