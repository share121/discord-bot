import { REST, Routes } from "discord.js";
import { clientId, token } from "./config.json";
import fs from "node:fs";
import path from "node:path";
import { exit } from "node:process";

const commands = [];
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.warn(
        `[警告] 位于 ${filePath} 的命令缺少必需的 \`data\` 或 \`execute\` 属性`
      );
    }
  }
}

const rest = new REST().setToken(token);

(async () => {
  console.log(`开始刷新 ${commands.length} 个应用程序（/）命令`);

  const data = await rest.put(Routes.applicationCommands(clientId), {
    body: commands,
  });

  console.log(
    // @ts-ignore
    `成功刷新 ${data.length} 个应用程序（/）命令`
  );

  exit();
})();
