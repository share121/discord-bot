import { config } from "../../config.ts";
import { AI } from "../ai.ts";
import { bot } from "../bot.ts";
import { aiMap, State } from "../commands/ai.ts";
import process from "node:process";

export const event: typeof bot.events.messageCreate = async (
  message,
) => {
  if (message.author.id === bot.id) return;
  const input = message.content.replaceAll(`<@${bot.id}>`, "");
  if (input === message.content) return;
  let ai = aiMap.get(message.channelId);
  if (!ai) {
    const isNsfw = (await bot.helpers.getChannel(message.channelId)).nsfw;
    ai = new AI(isNsfw ? config.nsfwAi : config.ai);
    aiMap.set(message.channelId, ai);
  }
  const prompt = `${message.author.username}：${input}`;
  const stream = ai.generate(prompt);
  console.log(prompt);
  let res = "";
  let state = State.finished;
  const reply = await bot.helpers.sendMessage(message.channelId, {
    content: "share121 的机器人正在响应……",
    messageReference: {
      messageId: message.id,
      channelId: message.channelId,
      guildId: message.guildId,
      failIfNotExists: false,
    },
  });
  for await (const chunk of stream) {
    res += chunk;
    process.stdout.write(chunk);
    if (state === State.finished) {
      state = State.pending;
      bot.helpers.editMessage(reply.channelId, reply.id, {
        content: res,
      })
        .catch(() => {})
        .finally(() => (state = State.finished));
    }
  }
  await bot.helpers.editMessage(reply.channelId, reply.id, {
    content: res,
  }).catch(() => {});
  process.stdout.write("\n\n");
};
