import { aiMap as commonAiMap } from "./ai.ts";
import { aiMap as privateAiMap } from "./ai-private.ts";
import type { Command } from "./index.ts";
import { ApplicationCommandOptionTypes } from "discordeno";

export enum AiType {
  common,
  private,
}

export const command: Command = {
  name: "clear-context",
  description: "清理 ai 的上下文",
  options: [
    {
      name: "scope",
      description: "你需要清理哪个 ai 的上下文",
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
        await interaction.respond("当前频道还没有与 AI 对话过");
        return;
      }
      commonAiMap.delete(interaction.channelId!);
    } else {
      const ai = privateAiMap.get(interaction.user.id);
      if (!ai) {
        await interaction.respond("你还没有与 AI 对话过", {
          isPrivate: true,
        });
        return;
      }
      privateAiMap.delete(interaction.user.id);
    }
    await interaction.respond("已清理上下文", {
      isPrivate: args.scope === AiType.private,
    });
  },
};

export default command;
