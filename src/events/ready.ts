import type { bot } from "../bot.ts";

export const event: typeof bot.events.ready = (_, rawPayload) => {
  console.log(
    `以 ${rawPayload.user.username}#${rawPayload.user.discriminator} 身份登录`,
  );
};
