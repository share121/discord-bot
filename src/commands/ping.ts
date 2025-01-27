import type { Command } from "./index.ts";

export const command: Command = {
  name: "ping",
  description: "返回 Pong!",

  async execute(interaction) {
    await interaction.respond(`Pong!`);
  },
};

export default command;
