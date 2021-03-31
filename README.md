# djBot
 djBot is a simple Discord Bot that plays desired music in voice channels.
djBot works by searching for the requested song names on YouTube.com and streaming the audio of the first result to the voice channel. 

## How to Get it Running:

1. Download the repo
2. Download Node.js and npm ([website link](https://nodejs.org/en/download/))
    * [Windows 10: video tuturial to download Node.js and npm](https://youtu.be/X-FPCwZFU_8)
    * [MacOS: video tuturial to download Node.js and npm](https://youtu.be/rF1ZHmqvm8I)
3. Install Dependencies:
    * Open terminal/command prompt and go to the project directory (this directory should contain a src folder)
    * Type the following command into the terminal: ``` npm install ```
4. Setup Discord Application
    * Visit [Discord Dev Protal](https://discord.com/developers/applications) and make a new application
    * Go to the Bot tab once your in the Application page and add a bot
    * Copy the Bot Token and set the 'DISCORDJS_BOT_TOKEN' variable equal to that token in your .env file
5. Add the Discord bot from you Discord Application to your server
    * [video tutorial for adding a bot to a server](https://youtu.be/ypSSUTuh6SQ)
6. Run the program
    * Open terminal/command prompt
    * Go to the project directory
    * Enter the following command: ```node ./src/client.js```
    * ##### djBot will only execute commands if the user is in a voice channel

## Commands:
### Standard Command Format:

#### Command Structures: 
1. '![command]'
2. '![command] [parameter]'

> **_Example Command:_** '!add Darude Sandstorm'
 
> **_Example Command:_** '!pause'


- Add
  - ##### Adds the requested song to the end of the queue.
  - Invoke Tags: 'add', 'play'
  - Shortcut Tags: 'a', 'p'
  - Needs Parameter (song name)

- Skip
  - ##### Skips the current song in the queue.
  - Invoke Tags: 'skip'
  - Shortcut Tags: 's'

- Pause
  - ##### Pauses the current song; song won't play again until Resume command is called.
  - Invoke Tags: 'pause', 'halt'
  - Shortcut Tags: 'ps', 'h'

- Resume
  - ##### Resumes playing the current song.
  - Invoke Tags: 'resume', 'start'
  - Shortcut Tags: 'r', 'st'

- 8D filter
  - ##### Streams all remaining songs in the queue with 8D audio filter ([learn about 8D audio](https://www.digitaltrends.com/home-theater/what-is-8d-audio/)).
  - Invoke Tags: '8d'
  - Needs Parameter = 'off' to turn off 8D audio filter


### Natural Language Commands
djBot is abled to be controlled in natural language. To do so, call the bot's name and desire command (and parameter) afterwards.
> **_Example Command:_** 'Hey djBot can you please add the song Darude Sandstorm please?'

> **_Example Command:_** 'djbot skip the current song now!'


## Notable External Libraries:
  - ##### Discord.js ([documentation](https://discord.js.org/#/)): Used to interface with Discord API
  - ##### discord-player ([documentation](https://www.npmjs.com/package/discord-player)): Used to get songs and handle queue

##### Author: Rishabh Mehta
