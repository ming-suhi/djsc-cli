import { green } from "chalk";
import { deleteCommand, getCommands, postCommand } from "../services/commands-api";
import { compareCommands } from "../services/commands-data";

import Command from "../structures/command";

module.exports = class extends Command {
  name = "syncCommand";
  aliases = ["sc"];
  description = `Sync Discord with local. Deletes from Discord unexisting files in the local commands folder. Posts existing local files that is not posted on Discord.`;
  usage = "npx djsc sc";

  async execute(args?: string[]) {
    // get local commands
    const commandDatas = await getCommands(this.client.appID, this.client.botToken);
    const localCommands = this.client.appCommands;
    const { localOnly, databaseOnly, modified } = compareCommands(localCommands, commandDatas);

    // post local only
    for(let commandName of localOnly) {
      const command = localCommands.find(command => command.name == commandName)!;
      await postCommand(this.client.appID, this.client.botToken, command);
    }

    // edit modified
    for(let commandName of modified) {
      const command = localCommands.find(command => command.name == commandName)!;
      await postCommand(this.client.appID, this.client.botToken, command);
    }

    // delete database only
    for(let commandName of databaseOnly) {
      const command = commandDatas.find(data => data.name == commandName);
      await deleteCommand(this.client.appID, this.client.botToken, command!.id)
    }

    console.log(green(`Successfully synched commands. \n`));
  }
}