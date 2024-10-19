import * as cheerio from "cheerio";
import { Tool } from "ollama";

export const option: Tool = {
  type: "function",
  function: {
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "搜索内容",
        },
      },
      required: ["query"],
    },
    name: "search",
    description: "搜索功能",
  },
};

export async function execute(arg: { [key: string]: any }) {
  const h = await fetch(`https://cn.bing.com/search?q=${arg.query}`);
  const raw = await h.text();
  const $ = cheerio.load(raw);
  const title = $("#b_results > li > h2 > a")
    .toArray()
    .map((e) => $(e).text());
  const desc = $("#b_results > li > div.b_caption > p")
    .toArray()
    .map((e) => $(e).text().replace(/^网页/, ""));
  const res: { title: string; desc: string }[] = [];
  const len = Math.min(Math.min(title.length, desc.length), 3);
  for (let i = 0; i < len; i++) {
    res.push({
      title: title[i],
      desc: desc[i],
    });
  }
  return JSON.stringify(res);
}
