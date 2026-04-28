import { useState, useEffect } from "react";

// =============================================================================
// TOOL ALTERNATIVES (Single Source of Truth)
// Keys must match tool names used in curriculum exactly.
// =============================================================================
export const TOOL_ALTERNATIVES: Record<string, string[]> = {
  // AI Writing / Chat
  "ChatGPT":        ["DeepSeek (free)", "Kimi (free)", "Groq + Llama (free)"],
  "Claude":         ["DeepSeek (free)", "Kimi (free)", "Mistral AI (free)"],
  "Gemini":         ["DeepSeek", "Kimi", "Perplexity AI"],
  "Notion AI":      ["Obsidian + local AI plugin", "Craft", "Logseq"],
  "Perplexity AI":  ["DeepSeek (search mode)", "Kimi"],

  // Design & Images
  "Canva":          ["Microsoft Designer (free)", "Adobe Express (free)"],
  "Adobe Firefly":  ["Canva Dream Lab", "Liblib AI", "Seaart.ai"],
  "Midjourney":     ["Liblib AI", "Seaart.ai", "Ideogram 2.0"],
  "Ideogram":       ["Canva Dream Lab", "Liblib AI"],

  // Productivity / Docs
  "Notion":         ["Obsidian", "Craft", "Logseq"],
  "Google":         ["Bing", "DuckDuckGo"],
  "Google Colab":   ["Kaggle Notebooks (free)", "DeepNote"],
  "Google Workspace": ["Microsoft 365", "Zoho Docs"],
  "Loom":           ["Tella", "Screen Studio", "OBS (free)"],

  // Automation
  "Zapier":         ["n8n (self-host, free)", "Make (Integromat)"],
  "Make":           ["n8n (self-host, free)", "Zapier"],
  "Buffer":         ["Later", "Publer", "Metricool"],

  // Coding
  "GitHub Copilot": ["Codeium (free)", "Tabnine (free tier)"],
  "Replit":         ["Cursor AI", "VS Code + Copilot", "Gitpod"],
  "Cursor AI":      ["VS Code + Codeium", "Gitpod"],

  // Audio / Video
  "ElevenLabs":     ["FishAudio", "Murf AI (free tier)", "TTSMaker (free)"],
  "Runway":         ["Kling AI", "Hailuo AI", "Pika Labs"],
  "Opus Clip":      ["CapCut AI (clip feature)", "Mango AI"],
  "Descript":       ["CapCut (free)", "VN Editor"],

  // Business / Payments
  "Stripe":         ["PayPal", "Wise Business", "Payoneer"],
};

// =============================================================================
// BLOCKED TOOLS BY REGION
// =============================================================================
export const BLOCKED_TOOLS: Record<string, { countryName: string; blocked: string[]; alternatives: string[] }> = {
  // ── Mainland China ────────────────────────────────────────────────────────
  CN: {
    countryName: "China (Mainland)",
    blocked: [
      "ChatGPT", "Claude", "Gemini", "Perplexity AI",
      "Google", "Google Workspace", "Google Colab",
      "Notion", "GitHub Copilot",
      "Midjourney", "Adobe Firefly",
      "Buffer", "Zapier",
      "Loom", "ElevenLabs",
    ],
    alternatives: [
      "DeepSeek", "Kimi", "Tongyi Qianwen (Alibaba)",
      "WPS AI", "Gitee Copilot", "Liblib AI",
      "Feishu (Lark)", "n8n (self-host)",
    ],
  },

  // ── Hong Kong ─────────────────────────────────────────────────────────────
  // UPDATE: OpenAI (ChatGPT) and Anthropic (Claude) both geo-block Hong Kong IPs directly.
  HK: {
    countryName: "Hong Kong",
    blocked: ["Claude", "ChatGPT", "OpenAI", "Anthropic"],
    alternatives: ["DeepSeek (free)", "Kimi (free)", "Mistral AI (free)", "Poe"],
  },

  // ── Russia ────────────────────────────────────────────────────────────────
  RU: {
    countryName: "Russia",
    blocked: ["ChatGPT", "Claude", "Notion", "Loom"],
    alternatives: ["GigaChat (Sber)", "YandexGPT", "DeepSeek", "Obsidian"],
  },

  // ── Iran ──────────────────────────────────────────────────────────────────
  IR: {
    countryName: "Iran",
    blocked: ["ChatGPT", "Claude", "Google", "Google Workspace", "Canva", "Notion", "Stripe"],
    alternatives: ["DeepSeek", "local alternatives", "Payoneer"],
  },

  // ── North Korea ───────────────────────────────────────────────────────────
  KP: {
    countryName: "North Korea",
    blocked: [
      "ChatGPT", "Claude", "Gemini", "Google", "Canva", "Notion",
      "Adobe Firefly", "Midjourney", "Zapier", "Buffer", "Stripe",
    ],
    alternatives: ["No widely available alternatives — internet access is state-controlled."],
  },

  // ── Cuba ──────────────────────────────────────────────────────────────────
  CU: {
    countryName: "Cuba",
    blocked: ["ChatGPT", "Claude", "Stripe"],
    alternatives: ["DeepSeek", "Kimi", "Payoneer"],
  },

  // ── Syria ─────────────────────────────────────────────────────────────────
  SY: {
    countryName: "Syria",
    blocked: ["ChatGPT", "Claude", "Stripe"],
    alternatives: ["DeepSeek", "Kimi"],
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getCountryName(code: string): string {
  return BLOCKED_TOOLS[code]?.countryName ?? code;
}

export function getAlternatives(tool: string, countryCode?: string | null): string[] {
  // Tool-specific alternatives first
  if (TOOL_ALTERNATIVES[tool]?.length) return TOOL_ALTERNATIVES[tool];
  
  // Fall back to region-level alternatives
  if (countryCode && BLOCKED_TOOLS[countryCode]) {
    return BLOCKED_TOOLS[countryCode].alternatives;
  }
  return [];
}

export function isToolBlocked(tool: string, blockedTools: string[]): boolean {
  return blockedTools.some((b) => tool.toLowerCase().includes(b.toLowerCase()));
}

export function getBlockedLessonTools(
  lessonTools: string[],
  blockedTools: string[],
  countryCode?: string | null
): Array<{ tool: string; alternatives: string[] }> {
  return lessonTools
    .filter((t) => isToolBlocked(t, blockedTools))
    .map((tool) => ({
      tool,
      alternatives: getAlternatives(tool, countryCode),
    }));
}

// =============================================================================
// REACT HOOK
// =============================================================================
export function useRegion() {
  const [isHK, setIsHK] = useState(false);
  const [blockedTools, setBlockedTools] = useState<string[]>([]);
  const [countryCode, setCountryCode] = useState<string | null>(null);

  useEffect(() => {
    // Basic automatic timezone detection to apply HK rules
    try {
      const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const isHongKong = timeZone === "Asia/Hong_Kong" || timeZone === "Asia/Macau";
      
      if (isHongKong) {
        setIsHK(true);
        setCountryCode("HK");
        setBlockedTools(BLOCKED_TOOLS["HK"].blocked);
      }
    } catch (e) {
      setBlockedTools([]);
    }
  }, []);

  return {
    isHK,
    countryCode,
    blockedTools,
  };
}
