import ollama, { ChatRequest, Message, Tool } from "ollama";
import { Mutex } from "async-mutex";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

const constraints = "\n\n约束：不包含借口或上下文，只返回答案。";
try {
  spawn("ollama", ["serve"]);
} catch {}

let tools: {
  option: Tool;
  execute: (arg: { [key: string]: any }) => Promise<string> | string;
}[] = [];

const foldersPath = path.join(__dirname, "ai-tools");
const aiToolsFolders = fs.readdirSync(foldersPath);

for (const folder of aiToolsFolders) {
  const toolsPath = path.join(foldersPath, folder);
  const toolFiles = fs
    .readdirSync(toolsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of toolFiles) {
    const filePath = path.join(toolsPath, file);
    const tool = require(filePath);
    if ("option" in tool && "execute" in tool) {
      tools.push(tool);
    } else {
      console.warn(
        `[警告] 位于 ${filePath} 的命令缺少必需的 \`option\` 或 \`execute\` 属性`
      );
    }
  }
}

export function createAi({ contextSize }: { contextSize: number }) {
  let messages: Message[] = [];
  const mutex = new Mutex();

  async function* ai(prompt: string, options: ChatRequest) {
    // 清理历史记录
    let len = messages.length - contextSize;
    if (len > 0) messages = messages.slice(len);

    // 生成 prompt
    const msg = prompt + constraints;
    messages.push({ role: "user", content: msg });

    // 检测模型是否安装
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

    // 请求
    const response = await ollama.chat({
      ...options,
      messages: [...(options.messages ?? []), ...messages],
      tools: tools.map((t) => t.option),
      stream: false,
    });
    messages.push(response.message);

    // 检测是否使用工具
    if (!response.message.tool_calls || !response.message.tool_calls.length) {
      console.log("模型未使用工具");
      yield response.message.content;
      return;
    }

    // 使用工具
    console.log(
      `模型使用工具: ${response.message.tool_calls
        .map((t) => t.function.name)
        .join(", ")}`
    );
    const promises: Promise<string>[] = [];
    for (const tool of response.message.tool_calls) {
      const fn = tools.find(
        (t) => t.option.function.name === tool.function.name
      )?.execute;
      if (!fn) {
        console.warn(`未找到工具 ${tool.function.name} 的执行函数`);
        continue;
      }
      promises.push(Promise.resolve(fn(tool.function.arguments)));
    }
    for (const result of await Promise.all(promises)) {
      messages.push({
        role: "tool",
        content: result,
      });
    }

    const finalResponse = await ollama.chat({
      ...options,
      messages: [...(options.messages ?? []), ...messages],
      stream: true,
    });
    let content = "";
    for await (const chunk of finalResponse) {
      const t = chunk.message.content;
      if (t) {
        content += t;
        yield t;
      }
    }
    messages.push({ role: "assistant", content });
  }

  return async function* (prompt: string, options: ChatRequest) {
    const release = await mutex.acquire();
    try {
      yield* ai(prompt, options);
    } finally {
      release();
    }
  };
}
