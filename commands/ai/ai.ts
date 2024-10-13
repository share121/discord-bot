import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { createAi } from "../../ai";
import { model } from "../../config.json";

export const data = new SlashCommandBuilder()
  .setName("ai")
  .setDescription("与 AI 聊天")
  .addStringOption((option) =>
    option
      .setName("输入内容")
      .setDescription("输入你想与 AI 聊天的内容")
      .setRequired(true)
  );
const ai = createAi({
  globalMsg: [
    {
      role: "system",
      content:
        "你是一个 Discord Bot，你将收到来自 Discord 的消息，我将会以 `用户名：输入内容` 的形式向你提供这些信息，你需要回答他们的问题",
    },
  ],
  model,
});

export async function execute(interaction: ChatInputCommandInteraction) {
  const input = interaction.options.getString("输入内容");
  if (!input) {
    await interaction.reply("请输入内容");
    return;
  }
  await interaction.deferReply();
  console.log(`输入内容：${input}`);
  let content = "";
  let state = State.finished;
  for await (const chunk of ai(`${interaction.user.username}：${input}`)) {
    content += chunk;
    process.stdout.write(chunk);
    if (state === State.finished) {
      state = State.waiting;
      interaction
        .editReply(content)
        .catch(() => {})
        .finally(() => (state = State.finished));
    }
  }
  interaction.editReply(content).catch(() => {});
  process.stdout.write("\n\n");
}

enum State {
  waiting,
  finished,
}
