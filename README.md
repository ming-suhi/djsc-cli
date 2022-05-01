<p align="right">
  <a href="https://discord.com/invite/P3UMxQCEaY" target="_blank">
    <img src="https://discordapp.com/api/guilds/753818535440023593/widget.png?style=shield" alt="Discord Server">
  </a>
</p>
<p align="right">
  <a href="https://discord.com/invite/P3UMxQCEaY" target="_blank">
    <text>Join Support Server | Meet Developer</text>
  </a>
</p>

# **[@ming-suhi/djsc-cli](https://github.com/ming-suhi/djsc-cli)**
A package for posting, updating, and deleting Discord Application Commands from the command line or terminal. 

### Automatic Operation
It has a `sync` command; which will `post` to discord local commands not posted, `update` to discord commands modified locally, and `delete` from discord commands that doesn't exist locally.

### Manual Operation
It also offers manual `post` and `delete` command to accommodate special needs. To make manual operations more easier, the package also offers a `compare` command that compares the status of commands locally and on Discord. Open CLI package main menu for list of commands.

## Quick Start
### A. Installing

Run npm install on the command line or terminal.
```
npm install @ming-suhi/djsc-cli
```

### B. Setting up config

Create a config file on the project root with name `djsc.config.js`.
```js
module.exports = {
  appId: "DISCORD_APPLICATION_ID",
  botToken: "DISCORD_BOT_TOKEN",
  mapCommands: () => {
    // function that return array of JSON(raw-data) of local commands
  }
}
``` 

For `discord.js` builders, it has an inbuilt function for getting the raw-data of a command.
```js
mapCommands: () => {
  // Example for discord.js users
  const commands = [];
  const commandsDir = path.resolve("src/commands");
  for(let filePath of readdirSync(commandsDir)) {
    const commandPath = path.resolve(commandsDir, filePath);
    const command = require(commandPath);
    commands.push(command.toJSON());
  }
  return commands;
}
```
`mapCommands` is essential because it is through which that the cli package can sense the local commands.

### C. Usage
To access the main menu of the cli tool, open a terminal inside the project directory and run `npx djsc` or `npx djsc help`.
```
npx djsc
```

## Contributing
### A. Issues
This project uses GitHub Issues to track bugs and feature requests. Please search the existing issues before filing new issues to avoid duplicates. For new issues, file your bug or feature request as a new issue.

For help and questions about using this project, please open a GitHub issue.

### B. Pull requests

1. Fork the project.

2. Create a topic branch from master.

3. Make some commits to improve the project.

4. Push this branch to your GitHub project.

5. Open a Pull Request on GitHub.

6. Discuss, and optionally continue committing.


## License
MIT © 明suhi