# Discord 机器人

## 使用

### 克隆项目

```bash
git clone https://github.com/share121/discord-bot.git
cd discord-bot
pnpm i
```

### 安装 Ollama

下载地址：https://ollama.com/download

### 安装 Qwen2.5

```bash
ollama pull qwen2.5:7b
```

### 配置机器人

```bash
cp config.example.json config.json
```

然后修改 `config.json` 中的配置

### 部署到服务器

```bash
pnpm deploy-commands
```

### 启动

```bash
pnpm start
```

## 功能

### AI

- 使用 `/ai` 命令与 Qwen2.5 对话
- 使用 `/cat-gril` 命令与「猫娘」对话

### 工具

- 使用 `/ping` 命令测试 bot 的响应速度

## 问题排查

### 部署命令失败

删除 `dist` 目录后重试

## 项目结构

```
discord-bot
├── commands # 斜杆（/）命令
│   ├── ai # AI 命令
│   │   ├── ai.ts
│   │   └── cat-girl.ts
│   └── utility # 工具命令
│       └── ping.ts
├── events # Discord 事件
│   ├── error.ts # 防止程序崩溃
│   ├── ready.ts # 机器人启动事件
│   └── interaction-create.ts # 分发 Discord 事件，在此处调用 `commands` 目录下对应的命令
├── dist # 生成的产物，不会自动删除，需要每次手动删除
├── deploy-commands.ts # 部署斜杆命令，使用 `pnpm deploy-commands` 命令执行
├── index.ts # 机器人执行入口，使用 `pnpm start` 命令执行
└── config.json # 配置文件
```
