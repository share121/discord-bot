import type { bot } from "../bot.ts";

export const event: typeof bot.events.ready = (_, rawPayload) => {
  console.log(
    `Logged in as ${rawPayload.user.username}#${rawPayload.user.discriminator} !`,
  );
};
