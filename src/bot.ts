import { createBot, GatewayIntents } from "discordeno";
import { config } from "../config.ts";
import events from "./events/index.ts";

export const bot = createBot({
  token: config.token,
  intents: GatewayIntents.GuildMessages | GatewayIntents.MessageContent,
  desiredProperties: {
    interaction: {
      id: true,
      data: true,
      type: true,
      token: true,
      channelId: true,
      user: true,
      channel: true,
    },
    user: {
      username: true,
      id: true,
    },
    message: {
      content: true,
      author: true,
      id: true,
      channelId: true,
      guildId: true,
    },
  },
});
bot.events = events;

await bot.start();
