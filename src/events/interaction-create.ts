import type { bot } from "../bot.ts";
import commands from "../commands/index.ts";
import {
  commandOptionsParser,
  Interaction,
  InteractionTypes,
} from "discordeno";

export const event: typeof bot.events.interactionCreate = async (
  interaction,
) => {
  if (interaction.type === InteractionTypes.ApplicationCommand) {
    if (!interaction.data) return;

    const command = commands.get(interaction.data.name);
    if (!command) {
      console.warn(`找不到 "${interaction.data.name}" 指令`);
      return;
    }

    try {
      const args = commandOptionsParser(interaction);
      console.log(
        `执行指令 "${interaction.data.name}", 参数: ${JSON.stringify(args)}`,
      );
      await command.execute(
        interaction as Interaction,
        args,
      );
    } catch (error) {
      console.error(
        `执行指令 "${interaction.data.name}" 失败`,
        error,
      );
    }
  }
};
