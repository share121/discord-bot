import { Events, Interaction } from "discord.js";

export const name = Events.InteractionCreate;
export async function execute(interaction: Interaction) {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) {
    console.error(`没有找到 ${interaction.commandName} 命令`);
    return;
  }
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: `执行此命令时出错！\n\n${error}`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: `执行此命令时出错！\n\n${error}`,
        ephemeral: true,
      });
    }
  }
}
