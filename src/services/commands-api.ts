import { RESTPostAPIApplicationCommandsJSONBody, RESTGetAPIApplicationCommandsResult } from "discord-api-types";
import fetch from "node-fetch-retry";

/**
 * Get all bot commands data from Discord.
 * @param appId Application Id
 * @param token Bot token
 */
export async function getCommands(appId: string, token: string): Promise<RESTGetAPIApplicationCommandsResult> {
  const response = await fetch(`https://discord.com/api/v10/applications/${appId}/commands`, {
    method: 'GET',
    headers: {'Authorization': `Bot ${token}`},
    retry: 3, 
    pause: 5000,
    silent: true
  })
  const commands = await response.json();
  return commands;
}

/**
 * Post command data to Discord.
 * @param appId Application Id
 * @param token Bot token
 * @param data Command data
 */
export async function postCommand(appId: string, token: string, data: RESTPostAPIApplicationCommandsJSONBody) {
  const response = await fetch(`https://discord.com/api/v10/applications/${appId}/commands`, {
    method: 'POST',
    headers: {
      'Authorization': `Bot ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
    retry: 3, 
    pause: 5000,
    silent: true
  });
  const status = await response.json();
  return status;
}

/**
 * Delete a command by id.
 * @param appId Application Id
 * @param token Bot token
 * @param commandId Command Id
 */
export async function deleteCommand(appId: string, token: string, commandId: string) {
  const response = await fetch(`https://discord.com/api/v10/applications/${appId}/commands/${commandId}`, {
    method: 'DELETE',
    headers: {'Authorization': `Bot ${token}`},
    retry: 3, 
    pause: 5000,
    silent: true
  });
  const status = await response.text();
  return status;
}