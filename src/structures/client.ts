import { RESTPostAPIApplicationCommandsJSONBody } from "discord-api-types";
import { getFilePaths } from "../services/file-system";
import { resolve } from "path";
import CLICommand from "./command";

export default class Client {
  /**
   * Map of CLI Commands.
   */
  readonly commands: Map<string, CLICommand> = new Map;
  /**
   * @param appID Id of the application the bot is affiliated with
   * @param botToken Bot token
   */
  constructor(readonly appID: string, readonly botToken: string, readonly appCommands: RESTPostAPIApplicationCommandsJSONBody[]) {
    for (let commandPath of getFilePaths(resolve(__dirname, "..", "commands"))) {
      const command = new (require(commandPath))(this);
      this.commands.set(command.name.toLowerCase(), command);
      if (command.aliases) for (let alias of command.aliases) this.commands.set(alias.toLowerCase(), command);
    }
  }
}