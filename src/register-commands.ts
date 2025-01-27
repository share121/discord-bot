import { bot } from "./bot.ts";
import commands from "./commands/index.ts";
import { config } from "../config.ts";

if (config.testGuildId === undefined) {
  await bot.rest.upsertGlobalApplicationCommands([
    ...commands.values(),
  ]);
} else {
  await bot.rest.upsertGuildApplicationCommands(config.testGuildId, [
    ...commands.values(),
  ]);
}
console.log(
  "Successfully registered commands:",
  [...commands.keys()],
);
