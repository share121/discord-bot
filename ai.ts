import ollama, { Message } from "ollama";
import { Mutex } from "async-mutex";
import { spawn } from "child_process";

const constraints = "\n\n约束：不包含借口或上下文，只返回答案。";
try {
  spawn("ollama", ["serve"]);
} catch {}

export function createAi({
  model,
  globalMsg = [],
  historyLength = 10,
}: {
  globalMsg?: Message[];
  historyLength?: number;
  model: string;
}) {
  let messages: Message[] = [];
  const aiMutex = new Mutex();

  async function* ai(prompt: string) {
    let len = messages.length - historyLength * 2;
    if (len > 0) messages = messages.slice(len);
    const msg = prompt + constraints;
    messages.push({ role: "user", content: msg });
    try {
      const models = await ollama.list();
      const modelInfo = models.models.find((m) => m.name === model);
      if (modelInfo === undefined) {
        throw new Error(
          `你还没有安装 ${model} 模型，你可以使用 \`ollama pull ${model}\` 来安装`
        );
      }
    } catch {
      spawn("ollama", ["serve"]);
      throw new Error("ollama 未启动，已为你自动启动 ollama");
    }
    const stream = await ollama.chat({
      messages: [...globalMsg, ...messages],
      model,
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
  return async function* (prompt: string) {
    const release = await aiMutex.acquire();
    try {
      yield* ai(prompt);
    } finally {
      release();
    }
  };
}
