import { red, green } from "chalk";
import { postCommand } from "../services/commands-api";

import Command from "../structures/command";

module.exports = class extends Command {
  name = "postCommand";
  aliases = ["pc"];
  description = "Post a specific command from your commands folder to Discord by name.";
  usage = "npcx djsc pc <commandName>";

  async execute(args?: string[]) {
    // check if command name was provided
    const commandName = args?.[0];
    if(!commandName) return console.log(red(`Command name not provided \n`));

    // get local commands
    const localCommand = this.client.appCommands.find(command => command.name == commandName);
    if(!localCommand) return console.log(red(`No command found with the name: ${commandName} \n`));

    // post command
    await postCommand(this.client.appID, this.client.botToken, localCommand);
    console.log(green(`Posted command with the name: ${commandName} \n`));
  }
}