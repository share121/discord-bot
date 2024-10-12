import { spawn } from "child_process";
import OpenAI from "openai";
import { ChatCompletionMessageParam } from "openai/resources";
import { Mutex } from "async-mutex";

spawn("ollama", ["serve"]);
const aiClient = new OpenAI({
  baseURL: "http://localhost:11434/v1/",
  apiKey: "ollama",
});
const constraints = "\n\n约束：不包含借口或上下文，只返回答案。";

export function createAi({
  globalMsg = [],
  historyLength = 10,
  model = "qwen2.5:7b",
}: {
  globalMsg?: ChatCompletionMessageParam[];
  historyLength?: number;
  model?: string;
}) {
  let messages: ChatCompletionMessageParam[] = [];
  const mutex = new Mutex();
  async function* ai(prompt: string) {
    const msg = prompt + constraints;
    messages.push({ role: "user", content: msg });
    let len = messages.length - historyLength;
    if (len > 0) messages = messages.slice(len);
    const stream = await aiClient.chat.completions.create({
      messages: [...globalMsg, ...messages],
      model,
      stream: true,
    });
    let content = "";
    for await (const chunk of stream) {
      const t = chunk.choices[0]?.delta?.content;
      if (t) {
        content += t;
        yield t;
      }
    }
    messages.push({ role: "assistant", content });
  }
  return async function* (prompt: string) {
    const release = await mutex.acquire();
    try {
      yield* ai(prompt);
    } finally {
      release();
    }
  };
}
