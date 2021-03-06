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
      const postcommand = this.client.commands.get("postcommand")!;
      await postcommand.execute([`${commandName}`]);
    }

    // edit modified
    for(let commandName of modified) {
      const postcommand = this.client.commands.get("postcommand")!;
      await postcommand.execute([`${commandName}`]);
    }

    // delete database only
    for(let commandName of databaseOnly) {
      const deleteCommand = this.client.commands.get("deletecommand")!;
      await deleteCommand.execute([`${commandName}`])
    }

    console.log(green(`Successfully synched commands. \n`));
  }
}