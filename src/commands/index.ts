import { CreateApplicationCommand, Interaction } from "discordeno";
import ping from "./ping.ts";
import ai from "./ai.ts";
import clearContext from "./clear-context.ts";
import showContext from "./show-context.ts";

export const commands = new Map<string, Command>(
  [ping, ai, clearContext, showContext].map((cmd) => [cmd.name, cmd]),
);

export default commands;

export type Command = CreateApplicationCommand & {
  execute(
    interaction: Interaction,
    args: Record<string, unknown>,
  ): Promise<unknown>;
};
