import type { bot } from "../bot.ts";
import { event as interactionCreateEvent } from "./interaction-create.ts";
import { event as readyEvent } from "./ready.ts";

export const events = {
  interactionCreate: interactionCreateEvent,
  ready: readyEvent,
} as typeof bot.events;

export default events;
