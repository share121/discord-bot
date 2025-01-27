import { ai } from "./ai.ts";
import type { Command } from "./index.ts";

export const command: Command = {
  name: "show-context",
  description: "显示 ai 的上下文",

  async execute(interaction) {
    const res = ai.showContext();
    await interaction.respond(`上下文为：
\`\`\`json
${JSON.stringify(res, null, 2).replaceAll("`", "\\`")}
\`\`\``);
  },
};

export default command;
