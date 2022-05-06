import { APIApplicationCommand, ApplicationCommandOptionType, APIApplicationCommandOption, ApplicationCommandType, RESTPostAPIApplicationCommandsJSONBody, RESTGetAPIApplicationCommandsResult } from "discord-api-types";
import { arrayToObject, getValueByReference, getArrayPropertyReferences, getBlankPropertyReferences, overwriteValueByReference, deletePropertyByReference } from "./data";
import * as _ from "lodash";

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

type PartialBy<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & Partial<Pick<T, K>>

export function transformCommand(database: APIApplicationCommand[]) {
  for(let command of database) {
    delete (command as PartialBy<APIApplicationCommand, "id">).id;
    delete (command as PartialBy<APIApplicationCommand, "version">).version;
    delete (command as PartialBy<APIApplicationCommand, "application_id">).application_id;
    delete (command as PartialBy<APIApplicationCommand, "default_permission">).default_permission;
    delete (command as any).dm_permission;
    delete (command as any).default_member_permissions;
  }
}

/**
 * Compare the local commands with discord commands
 * @param local Array of local command data
 * @param database Array of discord command data
 */
export function compareCommands(local: RESTPostAPIApplicationCommandsJSONBody[], database: RESTGetAPIApplicationCommandsResult) {
  transformCommand(database);
  for(let reference of getBlankPropertyReferences(local)) {
    deletePropertyByReference(local, reference)
  }
  for(let reference of getBlankPropertyReferences(database)) {
    deletePropertyByReference(database, reference)
  }
  for(let reference of getArrayPropertyReferences(local)) {
    overwriteValueByReference(local, reference, arrayToObject(getValueByReference(local, reference), "name"))
  }
  for(let reference of getArrayPropertyReferences(database)) {
    overwriteValueByReference(database, reference, arrayToObject(getValueByReference(database, reference), "name"))
  }
  const localOnly = local.map(command => command.name).filter(name => !database.find(command => command.name == name));
  const databaseOnly = database.map(command => command.name).filter(name => !local.find(command => command.name == name));
  const modified = local.filter(local => database.find(database => local.name == database.name))
  .filter(local => {
    return !(_.isEqual(local, database.find(database => local.name == database.name)))
  })
  .map(local => local.name)
  return {localOnly, databaseOnly, modified};
}