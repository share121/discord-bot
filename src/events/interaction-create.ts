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
      console.warn(`Command "${interaction.data.name}" not found`);
      return;
    }

    try {
      const args = commandOptionsParser(interaction);
      console.log(
        `Executing command "${interaction.data.name}", args: ${
          JSON.stringify(args)
        }`,
      );
      await command.execute(
        interaction as Interaction,
        args,
      );
    } catch (error) {
      console.error(
        `Error executing command "${interaction.data.name}"`,
        error,
      );
    }
  }
};
