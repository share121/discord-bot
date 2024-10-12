import { Client, Events } from "discord.js";

export const name = Events.Error;
export async function execute(error: Error, client: Client) {
  console.error(error);
}
