import { Client, Events } from "discord.js";

export const name = Events.ClientReady;
export const once = true;
export async function execute(client: Client<true>) {
  console.log(`成功以 ${client.user.tag} 身份登录`);
}
