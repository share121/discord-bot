import { AIConfig } from "./src/ai.ts";

export const config: Config = {
  clientId: "Discord 机器人的 Client ID",
  token: "Discord 机器人的 Token",
  testGuildId: "测试服务器的 Guild ID，如果不需要测试，请删除此属性",
  ai: {
    baseURL: "https://api.deepseek.com",
    apiKey: "你的 apiKey",
    model: "deepseek-chat",
    // 最大上下文长度，超过这个长度会截断到 fitContextSize 的长度
    // 一次提问、一次回答，算一个上下文
    maxContextSize: 20,
    fitContextSize: 2,
    systemPrompt: [{
      role: "system",
      content:
        "你是一个 Discord Bot，你将收到来自 Discord 的消息，我将会以 `用户名：输入内容` 的形式向你提供这些信息，你需要回答他们的问题",
    }],
    isMock: false, // 是否使用模拟数据，用于测试 ai
  },
  nsfwAi: {
    baseURL: "https://api.deepseek.com",
    apiKey: "你的 apiKey",
    model: "deepseek-chat",
    // 最大上下文长度，超过这个长度会截断到 fitContextSize 的长度
    // 一次提问、一次回答，算一个上下文
    maxContextSize: 20,
    fitContextSize: 2,
    systemPrompt: [{
      role: "system",
      content:
        "你是一个 Discord Bot，你将收到来自 Discord 的消息，我将会以 `用户名：输入内容` 的形式向你提供这些信息，你需要回答他们的问题",
    }],
    isMock: false, // 是否使用模拟数据，用于测试 ai
  },
};

interface Config {
  clientId: string;
  token: string;
  testGuildId?: string;
  ai: AIConfig;
  nsfwAi: AIConfig;
}
