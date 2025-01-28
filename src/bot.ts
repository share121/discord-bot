import { createBot } from "discordeno";
import { config } from "../config.ts";
import events from "./events/index.ts";

export const bot = createBot({
  token: config.token,
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
  },
});
bot.events = events;

await bot.start();
