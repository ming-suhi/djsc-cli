import { red } from "chalk";
import { APIApplicationCommand } from "discord-api-types";
import { getCommands } from "../services/commands-api";
import { getCommand } from "../services/commands-data";
import Command from "../structures/command";

module.exports = class extends Command {
  name = "getCommand";
  aliases = ["gc"];
  description = "Get and print all bot commands from Discord. Add command name as argument to get a specific command.";
  usage = "npx djsc gc <commandName>";
  
  async execute(args?: string[]) {
    const commandDatas: APIApplicationCommand[] = await getCommands(this.client.appID, this.client.botToken);

    if(args?.[0]) {
      const command = getCommand(commandDatas, args);
      if(!command) return console.log(red("Command not found."));
      console.log(command);
      if(args[args.length - 1] != command?.name) console.log("Command not found. Printed closest match.")
    } else {
      console.log(commandDatas);
    }
  }
}