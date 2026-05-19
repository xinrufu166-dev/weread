"use client";

import { useState } from "react";

const MOCK_KEY = "wrk-RJv4KzM8nPqXeLbTdWfYhSgAA";
const MASKED_KEY = "wrk-RJv4••••••••••SgAA";

export function ApiKeyCard() {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(MOCK_KEY);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 flex flex-col gap-5">
      <div className="text-sm text-gray-400 font-medium">2</div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-1">获取 API Key</h3>
        <p className="text-sm text-gray-500">API Key 用于连接你的微信读书账号，数据仅你可见</p>
      </div>

      <div className="border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between bg-gray-50">
        <span className="text-sm text-gray-700 font-mono tracking-wide">
          {showKey ? MOCK_KEY : MASKED_KEY}
        </span>
        <button
          onClick={() => setShowKey(!showKey)}
          className="text-gray-400 hover:text-gray-600 transition-colors ml-3"
        >
          {showKey ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
              <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium py-2.5 rounded-xl transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          {copied ? "已复制" : "复制 Key"}
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium py-2.5 rounded-xl transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
            <path d="M8 16H3v5" />
          </svg>
          重置 Key
        </button>
      </div>

      <p className="text-xs text-gray-400">创建于 2026-05-19 · 尚未使用</p>
    </div>
  );
}
