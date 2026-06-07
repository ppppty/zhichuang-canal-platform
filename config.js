// 部署配置 —— 根据环境切换
// 本地开发：所有值留空即可使用默认值
// 生产部署：填入实际的 OSS 和 Vercel 地址

const DEPLOY_CONFIG = {
  // AI 代理地址（Vercel 部署）
  // 本地开发时留空，会自动使用 /api/chat（由 serve.js 代理）
  apiBase: "https://zhichuang-canal-platform.vercel.app/api/chat",

  // 视频文件地址（GitHub Release 托管）
  // 本地开发时留空，会自动使用 /videos/（由 serve.js 代理）
  videoBase: "./videos/"
};
