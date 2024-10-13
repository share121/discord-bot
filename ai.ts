import ollama, { ChatRequest, Message } from "ollama";
import { Mutex } from "async-mutex";
import { spawn } from "child_process";

const constraints = "\n\n约束：不包含借口或上下文，只返回答案。";
try {
  spawn("ollama", ["serve"]);
} catch {}

export function createAi({ historyLength = 10 } = {}) {
  let messages: Message[] = [];
  const aiMutex = new Mutex();

  async function* ai(prompt: string, options: ChatRequest) {
    let len = messages.length - historyLength * 2;
    if (len > 0) messages = messages.slice(len);
    const msg = prompt + constraints;
    messages.push({ role: "user", content: msg });
    try {
      const models = await ollama.list();
      const modelInfo = models.models.find((m) => m.name === options.model);
      if (modelInfo === undefined) {
        throw new Error(
          `你还没有安装 ${options.model} 模型，你可以使用 \`ollama pull ${options.model}\` 来安装`
        );
      }
    } catch {
      spawn("ollama", ["serve"]);
      throw new Error("ollama 未启动，已为你自动启动 ollama");
    }
    const stream = await ollama.chat({
      ...options,
      messages: [...(options.messages ?? []), ...messages],
      stream: true,
    });
    let content = "";
    for await (const chunk of stream) {
      const t = chunk.message.content;
      if (t) {
        content += t;
        yield t;
      }
    }
    messages.push({ role: "assistant", content });
  }
  return async function* (prompt: string, options: ChatRequest) {
    const release = await aiMutex.acquire();
    try {
      yield* ai(prompt, options);
    } finally {
      release();
    }
  };
}
