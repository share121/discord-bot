import type { Command } from "./index.ts";
import { config } from "../../config.ts";
import { AI } from "../ai.ts";
import { ApplicationCommandOptionTypes } from "discordeno";
import process from "node:process";

export const aiMap = new Map<bigint, AI>();

enum State {
  finished,
  pending,
}

export const command: Command = {
  name: "ai-private",
  description: "与 DeepSeek-V3 对话，但你的对话只有你能看到",
  options: [
    {
      name: "prompt",
      description: "提示词",
      type: ApplicationCommandOptionTypes.String,
      required: true,
    },
  ],
  async execute(interaction, args: { prompt: string }) {
    let ai = aiMap.get(interaction.user.id);
    if (!ai) {
      ai = new AI(config.ai);
      aiMap.set(interaction.user.id, ai);
    }
    await interaction.defer(true);
    const prompt = `${interaction.user.username}：${args.prompt}`;
    const stream = ai.generate(prompt);
    console.log(prompt);
    let res = "";
    let state = State.finished;
    for await (const chunk of stream) {
      res += chunk;
      process.stdout.write(chunk);
      if (state === State.finished) {
        state = State.pending;
        interaction
          .edit(res)
          .catch(() => {})
          .finally(() => (state = State.finished));
      }
    }
    await interaction.edit(res).catch(() => {});
    process.stdout.write("\n\n");
  },
};

export default command;
