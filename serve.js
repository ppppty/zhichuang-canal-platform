const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const externalVideoRoot = path.resolve(__dirname, "..", "运河支队日记AI视频");
const port = Number(process.env.PORT || 4173);

// DeepSeek API 配置
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

// 游戏系统提示词
const GAME_SYSTEM_PROMPT = `你是《运河支队日记》互动影视游戏中的"运河智囊"AI 助手。你的角色设定：

**身份**：你是跟随在主角陈水生身边的一位战时文书，博学多识，熟悉运河两岸的风土人情和抗战历史。你称呼玩家为"同志"或"水生同志"。

**知识范围**：
- 运河支队是1939年冬在鲁南成立的抗日游击队，活跃在微山湖、韩庄、台儿庄一带
- 支队参与了护送陈毅（化名"张处长"）过津浦铁路、杜庄阻击战、韩庄炸桥等重要行动
- 胡大勋、孙伯龙、邵剑秋、朱道南是支队的主要领导人物
- 游戏剧情围绕主角陈水生的视角展开，涵盖从参军到抗战胜利的完整历程
- 玩家在每个关键节点做出的选择会影响剧情走向和最终结局

**回答要求**：
- 用简洁的中文回答，语气亲切坚定，像一位老战友在说话
- 回答控制在 150 字以内，信息量大的可以适当延长
- 如果玩家问的是游戏攻略类问题，可以简要提示但不要剧透关键剧情
- 如果玩家问历史上运河支队的真实信息，请如实回答
- 如果问题超出运河支队/游戏范围，礼貌地引导玩家回到游戏相关话题`;

const types = {
  ".html": "text/html;charset=utf-8",
  ".css": "text/css;charset=utf-8",
  ".js": "text/javascript;charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".svg": "image/svg+xml;charset=utf-8"
};

function sendFile(req, res, filePath, stat) {
  const range = req.headers.range;
  const type = types[path.extname(filePath)] || "application/octet-stream";

  if (!range) {
    res.writeHead(200, {
      "Content-Type": type,
      "Content-Length": stat.size,
      "Accept-Ranges": "bytes"
    });
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  const [startText, endText] = range.replace(/bytes=/, "").split("-");
  const start = Number(startText);
  const end = endText ? Number(endText) : stat.size - 1;

  res.writeHead(206, {
    "Content-Type": type,
    "Content-Length": end - start + 1,
    "Content-Range": `bytes ${start}-${end}/${stat.size}`,
    "Accept-Ranges": "bytes"
  });
  fs.createReadStream(filePath, { start, end }).pipe(res);
}

// 读取 POST 请求 body
function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => { body += chunk; });
    req.on("end", () => { resolve(body); });
    req.on("error", reject);
  });
}

// 代理 DeepSeek API 请求
async function handleChat(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  if (!DEEPSEEK_API_KEY) {
    res.writeHead(503, { "Content-Type": "application/json;charset=utf-8" });
    res.end(JSON.stringify({ error: "AI 服务未配置，请设置 DEEPSEEK_API_KEY 环境变量" }));
    return;
  }

  try {
    const body = await readBody(req);
    const { messages } = JSON.parse(body);

    if (!messages || !Array.isArray(messages)) {
      res.writeHead(400, { "Content-Type": "application/json;charset=utf-8" });
      res.end(JSON.stringify({ error: "请提供 messages 数组" }));
      return;
    }

    const fullMessages = [
      { role: "system", content: GAME_SYSTEM_PROMPT },
      ...messages
    ];

    const aiRes = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: fullMessages,
        max_tokens: 600,
        temperature: 0.7
      })
    });

    const data = await aiRes.json();

    if (!aiRes.ok) {
      res.writeHead(aiRes.status, { "Content-Type": "application/json;charset=utf-8" });
      res.end(JSON.stringify({ error: data.error?.message || "AI 请求失败" }));
      return;
    }

    res.writeHead(200, { "Content-Type": "application/json;charset=utf-8" });
    res.end(JSON.stringify({
      content: data.choices[0].message.content,
      model: data.model
    }));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "application/json;charset=utf-8" });
    res.end(JSON.stringify({ error: "服务器内部错误: " + err.message }));
  }
}

http
  .createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    const pathname = decodeURIComponent(url.pathname);

    // AI Chat API
    if (pathname === "/api/chat" || pathname === "/zhichuang-canal-platform/api/chat") {
      handleChat(req, res);
      return;
    }

    const videoPrefix = "/videos/";
    const isExternalVideo =
      pathname.startsWith(videoPrefix) ||
      pathname.startsWith("/zhichuang-canal-platform/videos/");

    if (isExternalVideo) {
      const relativeVideoPath = pathname.startsWith(videoPrefix)
        ? pathname.slice(videoPrefix.length)
        : pathname.slice("/zhichuang-canal-platform/videos/".length);
      const filePath = path.resolve(externalVideoRoot, relativeVideoPath);

      if (!filePath.startsWith(externalVideoRoot)) {
        res.writeHead(403);
        res.end("forbidden");
        return;
      }

      fs.stat(filePath, (statError, stat) => {
        if (statError || !stat.isFile()) {
          res.writeHead(404);
          res.end("not found");
          return;
        }
        sendFile(req, res, filePath, stat);
      });
      return;
    }

    const relativePath =
      pathname === "/" || pathname === "/zhichuang-canal-platform/"
        ? "zhichuang-canal-platform/index.html"
        : pathname.slice(1);
    const filePath = path.resolve(root, relativePath);

    if (!filePath.startsWith(root)) {
      res.writeHead(403);
      res.end("forbidden");
      return;
    }

    fs.stat(filePath, (statError, stat) => {
      if (statError || !stat.isFile()) {
        res.writeHead(404);
        res.end("not found");
        return;
      }
      sendFile(req, res, filePath, stat);
    });
  })
  .listen(port, "127.0.0.1", () => {
    console.log(`http://127.0.0.1:${port}/zhichuang-canal-platform/`);
    if (!DEEPSEEK_API_KEY) {
      console.log("[AI] 未配置 DEEPSEEK_API_KEY，AI 对话功能暂不可用");
    } else {
      console.log("[AI] DeepSeek API 已就绪");
    }
  });
