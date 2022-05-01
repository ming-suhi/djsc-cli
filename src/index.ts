#!node
import clear from "clear";

import { red } from "chalk";
import path from "path";
import { getFilePaths } from "./services/file-system";

import Client from "./structures/client";

async function main() {
  clear();
  const root = process.cwd();
  const configPath = path.resolve(root, "djsc.config.js");

  if(!Array.from(getFilePaths(root)).includes(configPath)) {
    return console.log(red("No djsc.config.js file found."));
  }

  const config = require(configPath);

  if(!config.appId) return console.log(red("appId not defined in config file\n"));
  if(!config.botToken) return console.log(red("botToken not defined in config file\n"));
  if(!config.mapCommands) return console.log(red("mapCommands not defined in config file\n"));

  const commands = config.mapCommands();

  const client = new Client(config.appId, config.botToken, commands);
  const commandName = process.argv?.[2]?.toString()?.toLowerCase();
  const args = process.argv.slice(3);
  const command = client.commands.get(commandName) || client.commands.get("help")!;
  await command.execute(args);
}

main();