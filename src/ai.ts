import OpenAI from "@openai/openai";
import { Mutex } from "async-mutex";

export class AI {
  client;
  model;
  systemPrompt;
  maxContextSize;
  fitContextSize;
  isMock;
  history = [] as OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  mutex = new Mutex();

  constructor(config: AIConfig) {
    this.client = new OpenAI({
      baseURL: config.baseURL,
      apiKey: config.apiKey,
    });
    this.model = config.model;
    this.systemPrompt = config.systemPrompt;
    this.maxContextSize = config.maxContextSize;
    this.fitContextSize = config.fitContextSize;
    this.isMock = config.isMock;
  }

  resetup(config: AIConfig) {
    this.client = new OpenAI({
      baseURL: config.baseURL,
      apiKey: config.apiKey,
    });
    this.model = config.model;
    this.systemPrompt = config.systemPrompt;
    this.maxContextSize = config.maxContextSize;
    this.fitContextSize = config.fitContextSize;
    this.isMock = config.isMock;
  }

  async *generate(prompt: string) {
    const release = await this.mutex.acquire();
    try {
      if (this.needClearHistory()) {
        this.history = this.history.slice(-2 * this.fitContextSize);
      }
      this.history.push({
        role: "user",
        content: prompt,
      });
      let stream;
      if (!this.isMock) {
        stream = await this.client.chat.completions.create({
          model: this.model,
          messages: this.systemPrompt.concat(this.history),
          stream: true,
        });
      } else {
        stream = mockAI();
      }
      let fullResponse = "";
      let t = "";
      for await (const chunk of stream) {
        let token;
        if (!this.isMock) {
          token =
            (chunk as OpenAI.Chat.Completions.ChatCompletionChunk).choices[0]
              ?.delta?.content || "";
        } else {
          token = chunk as string;
        }
        t += token;
        fullResponse += token;
        if (token.trim() !== "") {
          yield t;
          t = "";
        }
      }
      if (t !== "") yield t;
      this.history.push({
        role: "assistant",
        content: fullResponse,
      });
    } finally {
      release();
    }
  }

  clearContext() {
    this.history = [];
  }

  showContext() {
    return this.history;
  }

  needClearHistory() {
    return this.history.length / 2 > this.maxContextSize;
  }
}

export interface AIConfig {
  baseURL: string;
  apiKey: string;
  model: string;
  maxContextSize: number;
  fitContextSize: number;
  systemPrompt: OpenAI.Chat.Completions.ChatCompletionMessageParam[];
  isMock: boolean;
}

async function* mockAI(): AsyncIterable<string> {
  const mockResponse = `当然！以下是一个使用 Python 实现的快速排序算法：

\`\`\`python
def quicksort(arr):
    # 如果数组长度小于等于1，直接返回
    if len(arr) <= 1:
        return arr
    
    # 选择基准元素（这里选择数组的最后一个元素）
    pivot = arr[-1]
    
    # 分区操作
    left = [x for x in arr[:-1] if x <= pivot]  # 小于等于基准的元素
    right = [x for x in arr[:-1] if x > pivot]  # 大于基准的元素
    
    # 递归排序左右子数组，并将结果合并
    return quicksort(left) + [pivot] + quicksort(right)

# 示例用法
arr = [3, 6, 8, 10, 1, 2, 1]
sorted_arr = quicksort(arr)
print("排序后的数组:", sorted_arr)
\`\`\`

### 代码解释：
1. **基准选择**：我们选择数组的最后一个元素作为基准（\`pivot\`）。
2. **分区操作**：将数组分为两部分，一部分是小于等于基准的元素，另一部分是大于基准的元素。
3. **递归排序**：对左右两部分分别递归调用 \`quicksort\` 函数。
4. **合并结果**：将左部分、基准元素和右部分合并起来，得到最终的排序结果。

### 示例输出：
\`\`\`python
排序后的数组: [1, 1, 2, 3, 6, 8, 10]
\`\`\`

这个实现是快速排序的一个简单版本，适合理解算法的基本思想。在实际应用中，可能会使用更复杂的基准选择策略和优化技巧来提高性能。`
    .split("\n");
  for (const line of mockResponse) {
    yield line + "\n";
    await sleep(1000);
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
