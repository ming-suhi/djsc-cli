import { getCommand } from "./commands-data";
import commandData from "../mocks/channels.json";
import { APIApplicationCommand } from "discord-api-types";

describe("CommandsMap", () => {

  describe("getCommand function", () => {
    
    it("should return undefined", () => {
      const command = getCommand([commandData], ["doesnotexist", "doesnotexist", "doesnotexist"]);
      expect(command).toEqual(undefined);
    });

    it("should get command", () => {
      const command = getCommand([commandData], ["moderate"]);
      expect(command).toEqual(commandData);
    });

    it("should get subcommandgroup", () => {
      const command = getCommand([commandData], ["moderate", "member"]);
      expect(command).toEqual(commandData.options?.find(option => option.name == "member"));
    });

    it("should get subcommand", () => {
      const command = getCommand([commandData], ["moderate", "member", "timeout"]);
      console.log(command)
      expect(command).toEqual(commandData.options?.find(option => option.name == "member")?.options?.find(option => option.name == "timeout"));
    });
  });
})