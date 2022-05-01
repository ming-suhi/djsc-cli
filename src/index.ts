#!node

import { red } from "chalk";
import path from "path";
import { getFilePaths } from "./services/file-system";

import Client from "./structures/client";

async function main() {
  const root = process.cwd();
  const configPath = path.resolve(root, "djsc.config.js");

  if(!Array.from(getFilePaths(root)).includes(configPath)) {
    return console.log(red("No djsc.config.js file found."));
  }

  const config = require(configPath);
  
  if(!config.appId) return console.log(red("APP_ID not defined in .env file\n"));
  if(!config.botToken) return console.log(red("BOT_TOKEN not defined in .env file\n"));
  if(!config.mapCommands) return console.log(red("COMMANDS_FOLDER not defined in .env file\n"));

  const commands = config.mapCommands();

  const client = new Client(config.appId, config.botToken, commands);
  const commandName = process.argv?.[2]?.toString()?.toLowerCase();
  const args = process.argv.slice(3);
  const command = client.commands.get(commandName) || client.commands.get("help")!;
  await command.execute(args);
}

main();