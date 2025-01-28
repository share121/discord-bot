import { aiMap as commonAiMap } from "./ai.ts";
import { aiMap as privateAiMap } from "./ai-private.ts";
import type { Command } from "./index.ts";
import { ApplicationCommandOptionTypes } from "discordeno";
import { AiType } from "./clear-context.ts";

export const command: Command = {
  name: "show-context",
  description: "显示 ai 的上下文",
  options: [
    {
      name: "scope",
      description: "你需要展示哪个 ai 的上下文",
      type: ApplicationCommandOptionTypes.Integer,
      choices: [
        { name: "当前频道", value: AiType.common },
        { name: "私人", value: AiType.private },
      ],
      required: true,
    },
  ],
  async execute(interaction, args: { scope: AiType }) {
    if (args.scope === AiType.common) {
      const ai = commonAiMap.get(interaction.channelId!);
      if (!ai) {
        await interaction.respond("这个频道还没有与 AI 对话过");
        return;
      }
      await interaction.respond(`上下文为：
\`\`\`json
${JSON.stringify(ai.showContext(), null, 2).replaceAll("`", "\\`")}
\`\`\``);
    } else {
      const ai = privateAiMap.get(interaction.user.id);
      if (!ai) {
        await interaction.respond("你还没有与 AI 对话过", {
          isPrivate: true,
        });
        return;
      }
      await interaction.respond(
        `上下文为：
\`\`\`json
${JSON.stringify(ai.showContext(), null, 2).replaceAll("`", "\\`")}
\`\`\``,
        {
          isPrivate: true,
        },
      );
    }
  },
};

export default command;
