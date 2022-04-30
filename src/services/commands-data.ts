import { APIApplicationCommand, ApplicationCommandOptionType, APIApplicationCommandOption, ApplicationCommandType, RESTPostAPIApplicationCommandsJSONBody, RESTGetAPIApplicationCommandsResult } from "discord-api-types";

/**
 * Access nested command data using names as pointers
 * @param data An array of application command data
 * @param name An array of names pointing to a specific command
 * @returns Application command data
 */
export function getCommand(data: RESTPostAPIApplicationCommandsJSONBody[], name: string[]): RESTPostAPIApplicationCommandsJSONBody | APIApplicationCommandOption | undefined {
  const commands: (RESTPostAPIApplicationCommandsJSONBody | APIApplicationCommandOption | null)[] = [];
  if(name.length >= 1) {
    const command = data.find(cmd => cmd.name == name[0]);
    if(command) {
      // Chat input
      if(command.type == ApplicationCommandType.ChatInput) commands.push(command)
      // User command or message command
      else commands.push(command, null, null);
    } else {
      // Not found
      commands.push(null, null, null);
    }
  }
  if(name.length >= 2 && commands[1] === undefined) {
    const command = (commands[0] as APIApplicationCommand).options?.find(cmd => cmd.name == name[1]);
    if(command) {
      // Subcommand
      if(command.type == ApplicationCommandOptionType.Subcommand) commands.push(command, null)
      // Subcommand Group
      else if(command.type == ApplicationCommandOptionType.SubcommandGroup) commands.push(command)
      // Fields
      else commands.push(null, null);
    } else {
      // Not found
      commands.push(null, null);
    }
  }
  if(name.length == 3 && commands[2] === undefined) {
    const command = (commands[1] as APIApplicationCommand).options?.find(cmd => cmd.name == name[2]);
    if(command && command.type == ApplicationCommandOptionType.Subcommand) {
      // Subcommand
      commands.push(command);
    } else {
      // Not found
      commands.push(null);
    }
  }
  return commands[2] ?? commands[1] ?? commands[0] ?? undefined;
}

/**
 * Compare the local commands with discord commands
 * @param local Array of local command data
 * @param database Array of discord command data
 */
export function compareCommands(local: RESTPostAPIApplicationCommandsJSONBody[], database: RESTGetAPIApplicationCommandsResult) {
  const localOnly = local.map(command => command.name).filter(name => !database.find(command => command.name == name));
  const databaseOnly = database.map(command => command.name).filter(name => !local.find(command => command.name == name));
  const modified = local.filter(local => database.find(command => command.name == local.name))
  .filter(local => JSON.stringify(local) != JSON.stringify(database.find(command => command.name == local.name)))
  .map(command => command.name)
  return {localOnly, databaseOnly, modified};
}