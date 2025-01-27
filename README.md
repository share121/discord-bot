# Discord Bot

这是一个 Discord 机器人，加入了 AI 功能。

## 步骤一：配置环境

安装 [Deno](https://deno.com/)

### Windows

```shell
irm https://deno.land/install.ps1 | iex
```

### Mac OS / Linux

```shell
curl -fsSL https://deno.land/install.sh | sh
```

## 步骤二：克隆仓库

### 方法一：从 GitHub 下载

```shell
git clone https://github.com/share121/discord-bot.git
```

### 方法二：使用镜像站

```shell
git clone https://gh.llkk.cc/https://github.com/share121/discord-bot.git
```

> [!TIP]
> 公益服务，请勿滥用。

## 步骤三：修改配置

1. 把 `config.example.ts` 重命名为 `config.ts`
2. 修改 `config.ts` 中的配置

## 步骤四：运行

```shell
deno run -A ./src/register-commands.ts
```
