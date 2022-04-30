#!node

import { red } from "chalk";
import path from "path";

import Client from "./structures/client";

async function main() {
  const config = require(path.resolve(require.main!.path, "djsc.config.js"));

  if(!config.appId) return console.log(red("APP_ID not defined in .env file\n"));
  if(!config.botToken) return console.log(red("BOT_TOKEN not defined in .env file\n"));
  if(!config.getCommands) return console.log(red("COMMANDS_FOLDER not defined in .env file\n"));

  const commands = config.getCommands();

  const client = new Client(config.appId, config.botToken, commands);
  const commandName = process.argv?.[2]?.toString()?.toLowerCase();
  const args = process.argv.slice(3);
  const command = client.commands.get(commandName) || client.commands.get("help")!;
  await command.execute(args);
}

main();