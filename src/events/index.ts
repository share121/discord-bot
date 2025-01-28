import type { bot } from "../bot.ts";
import { event as interactionCreateEvent } from "./interaction-create.ts";
import { event as readyEvent } from "./ready.ts";
import { event as messageCreateEvent } from "./message-create.ts";

export const events = {
  interactionCreate: interactionCreateEvent,
  ready: readyEvent,
  messageCreate: messageCreateEvent,
} as typeof bot.events;

export default events;
