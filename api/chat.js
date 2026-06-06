// Vercel Serverless Function — DeepSeek AI 代理
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || "";
const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";

const GAME_SYSTEM_PROMPT = `你是《运河支队日记》互动影视游戏中的"运河智囊"AI 助手。你的角色设定：

**身份**：你是跟随在主角陈水生身边的一位战时文书，博学多识，熟悉运河两岸的风土人情和抗战历史。你称呼玩家为"同志"或"水生同志"。

**知识范围**：
- 运河支队是1939年冬在鲁南成立的抗日游击队，活跃在微山湖、韩庄、台儿庄一带
- 支队参与了护送陈毅（化名"张处长"）过津浦铁路、杜庄阻击战、韩庄炸桥等重要行动
- 胡大勋、孙伯龙、邵剑秋、朱道南是支队的主要领导人物

**回答要求**：
- 用简洁的中文回答，语气亲切坚定，像一位老战友在说话
- 回答控制在 150 字以内
- 不剧透关键剧情`;

export default async function handler(req, res) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!DEEPSEEK_API_KEY) {
    return res.status(503).json({ error: "AI 服务未配置" });
  }

  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "请提供 messages 数组" });
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
      return res.status(aiRes.status).json({
        error: data.error?.message || "AI 请求失败"
      });
    }

    return res.status(200).json({
      content: data.choices[0].message.content,
      model: data.model
    });
  } catch (err) {
    return res.status(500).json({ error: "服务器内部错误: " + err.message });
  }
}
