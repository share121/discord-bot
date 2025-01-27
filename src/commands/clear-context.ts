import { ai } from "./ai.ts";
import type { Command } from "./index.ts";

export const command: Command = {
  name: "clear-context",
  description: "清理 ai 的上下文",

  async execute(interaction) {
    ai.clearContext();
    await interaction.respond(`已清理上下文`);
  },
};

export default command;
