import { green, red, yellow } from "chalk";
import { getCommands } from "../services/commands-api";
import { compareCommands } from "../services/commands-data";
import Command from "../structures/command";


module.exports = class extends Command {
  name = "compareCommand";
  aliases = ["cc"];
  description = "Compare local commands with Discord commands.";
  usage = "npx djsc cc";
  
  async execute(args?: string[]) {
    // get commands
    const commandDatas = await getCommands(this.client.appID, this.client.botToken);
    const localCommands = this.client.appCommands;

    // compare commands
    const { localOnly, databaseOnly, modified } = compareCommands(localCommands, commandDatas);
    if(localOnly.length === 0 && databaseOnly.length === 0 && modified.length === 0) return console.log(green("Commands in sync."));
    console.log("Commands not in sync. Please sync using sync command or manually post and delete.");
    console.log(green(`+ Exists locally but not on Discord`));
    console.log(red("- Exists on Discord but not locally"));
    console.log(yellow("! Exists on both but of different properties\n"));
    for(let command of localOnly) console.log(green(`+ ${command}`));
    for(let command of databaseOnly) console.log(red(`- ${command}`));
    for(let command of modified) console.log(yellow(`! ${command}`));
    console.log("\n");
  }
}