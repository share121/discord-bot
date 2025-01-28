import { bot } from "./bot.ts";
import commands from "./commands/index.ts";
import { config } from "../config.ts";

if (!config.testGuildId) {
  await bot.rest.upsertGlobalApplicationCommands([
    ...commands.values(),
  ]);
  console.log(
    "成功在全局注册命令：",
    [...commands.keys()],
  );
} else {
  await bot.rest.upsertGuildApplicationCommands(config.testGuildId, [
    ...commands.values(),
  ]);
  console.log(
    `成功在测试服务器(${config.testGuildId})注册命令：`,
    [...commands.keys()],
  );
}
