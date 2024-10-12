import { REST, Routes } from "discord.js";
import { clientId, token } from "./config.json";
import fs from "node:fs";
import path from "node:path";

const commands = [];
// 从您之前创建的 commands 目录中获取所有命令文件夹
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  // 从您之前创建的 commands 目录中获取所有命令文件
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  // 获取每个命令数据的 SlashCommandBuilder#toJSON（） 输出以进行部署
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.warn(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

// 构造并准备 REST 模块的实例
const rest = new REST().setToken(token);

// 并部署您的命令！
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // put 方法用于使用当前集合完全刷新频道中的所有命令
    const data = await rest.put(Routes.applicationCommands(clientId), {
      body: commands,
    });

    console.log(
      // @ts-ignore
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // 当然，请确保捕获并记录任何错误！
    console.error(error);
  }
})();
