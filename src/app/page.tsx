import { CopyButton } from "@/components/CopyButton";
import { ApiKeyCard } from "@/components/ApiKeyCard";

const INSTALL_COMMAND =
  "下载 https://cdn.weread.qq.com/skills/weread-skills.zip 安装 skill";

const features = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: "查阅书架",
    desc: "浏览你的个人书架，快速了解藏书全貌",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
      </svg>
    ),
    title: "书籍搜索",
    desc: "在书城搜索任意书籍，快速获取书名、作者、评分等关键信息",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" x2="18" y1="20" y2="10" />
        <line x1="12" x2="12" y1="20" y2="4" />
        <line x1="6" x2="6" y1="20" y2="14" />
      </svg>
    ),
    title: "阅读统计",
    desc: "时长、天数、偏好深度分析，量化你的阅读习惯",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" />
        <path d="M3 9h18" />
        <path d="M9 21V9" />
      </svg>
    ),
    title: "书籍详情",
    desc: "查看书籍详情、章节目录、阅读进度，了解你的阅读旅程",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4Z" />
      </svg>
    ),
    title: "笔记和划线",
    desc: "查看个人划线和想法，导出笔记，回顾阅读中的思考",
  },
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    title: "推荐好书",
    desc: "基于你的阅读偏好，个性化推荐或相似书籍推荐",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Hero Section */}
      <section className="flex-1 max-w-6xl mx-auto w-full px-6 py-20 flex flex-col lg:flex-row items-center gap-16">
        {/* Left */}
        <div className="flex-1 flex flex-col gap-6">
          <div>
            <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-2">
              让 AI 成为
            </h1>
            <h1 className="text-5xl font-bold leading-tight">
              你的<span className="text-blue-500">阅读搭档</span>
            </h1>
          </div>
          <p className="text-gray-500 text-base">
            连接微信读书账号，让 AI 助手随时查阅你的阅读记录
          </p>
          <div>
            <a
              href="#setup"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-medium px-10 py-3 rounded-xl transition-colors text-base"
            >
              快速配置
            </a>
          </div>
        </div>

        {/* Right - Feature Card */}
        <div className="flex-1 w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-y divide-gray-100">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-5 hover:bg-gray-50 transition-colors"
                >
                  <div className="mt-0.5 shrink-0">{f.icon}</div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm mb-0.5">
                      {f.title}
                    </div>
                    <div className="text-gray-500 text-xs leading-relaxed">
                      {f.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WeRead Branding Strip */}
      <div className="border-t border-gray-200 bg-white py-5">
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <span className="text-gray-700 font-medium">微信读书</span>
        </div>
      </div>

      {/* Setup Section */}
      <section id="setup" className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">快速配置</h2>
            <p className="text-gray-500 text-base">
              安装 Skill 后即可通过 API Key 获取你的个人阅读信息
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 - Install Command */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col gap-5">
              <div className="text-sm text-gray-400 font-medium">1</div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  复制 Skill 安装指令
                </h3>
                <p className="text-sm text-gray-500">
                  将以下内容发送给你的 AI 助手，即可自动安装
                </p>
              </div>

              <div className="border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 min-h-[72px] flex items-center">
                <p className="text-sm text-gray-700 leading-relaxed break-all">
                  {INSTALL_COMMAND}
                </p>
              </div>

              <CopyButton
                text={INSTALL_COMMAND}
                label="复制指令"
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors w-full"
              />
            </div>

            {/* Card 2 - API Key */}
            <ApiKeyCard />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-gray-600 transition-colors">
              用户协议
            </a>
            <a href="#" className="hover:text-gray-600 transition-colors">
              隐私政策
            </a>
          </div>
          <span>© 2026 Tencent Inc. All Rights Reserved</span>
        </div>
      </footer>
    </div>
  );
}
