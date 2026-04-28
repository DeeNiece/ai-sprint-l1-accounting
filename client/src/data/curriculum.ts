// =============================================================================
// AI Sprint — Level 1 (Basic) Curriculum
// 28-Day Program: Foundations, Design Basics, and Personal Productivity
// Updated: April 2026
// =============================================================================

export type Category = "Design" | "Graphics" | "Rendering" | "Automation" | "Coding" | "Mixed";

export interface DayLesson {
  day: number;
  week: number;
  title: string;
  category: Category;
  summary: string;
  task: string;
  tools: string[];
  whyItMatters: string;
  isMiniProject?: boolean;
}

export interface WeekOverview {
  week: number;
  title: string;
  color: string;
  outcomes: string[];
}

export interface ToolkitItem {
  name: string;
  url: string;
  category: string;
  desc: string;
}

export interface PortfolioTarget {
  title: string;
  week: number;
  desc: string;
}

// ─────────────────────────────────────────────
// CURRICULUM — 28 Days
// ─────────────────────────────────────────────

export const curriculum: DayLesson[] = [

  // ── WEEK 1: AI Basics, Prompting & Productivity ──────────────────────────
  {
    day: 1, week: 1,
    title: "Welcome to AI — How It Actually Works",
    category: "Mixed",
    summary: "Learn what AI tools are, how they generate output, and how to think about them as creative partners rather than magic boxes. Get comfortable with the idea of prompting as a skill.",
    task: "Sign up for ChatGPT (free) and Gemini (free). Have a 15-minute conversation with each — ask them to explain themselves. Note what surprises you. Hong Kong users: both Claude and ChatGPT are geo-blocked — use Gemini (gemini.google.com) as your primary tool throughout this course.",
    tools: ["ChatGPT", "Gemini", "Perplexity AI"],
    whyItMatters: "Understanding AI tools lets you confidently describe your services and set realistic expectations with clients — whether you're a VA, freelancer, entrepreneur, or just someone who wants to work smarter.",
  },
  {
    day: 2, week: 1,
    title: "Prompt Writing 101 — Getting Clear Results",
    category: "Mixed",
    summary: "Discover the anatomy of a great prompt: role, context, task, format. Learn why vague prompts give vague results, and how to be specific without being complicated. Get introduced to 'system prompts' as a concept.",
    task: "Write 5 different prompts asking your AI tool to write an Instagram caption for a bakery. Compare results. Rewrite your best prompt adding role + format instructions. Then try the same prompt in both ChatGPT and Gemini and compare the outputs.",
    tools: ["ChatGPT", "Gemini"],
    whyItMatters: "Writing effective prompts is the core skill of AI-assisted work. Every service you offer starts here — the gap between a vague prompt and a well-structured one is the gap between mediocre and client-ready output.",
  },
  {
    day: 3, week: 1,
    title: "Your AI Writing Assistant — Drafts in Minutes",
    category: "Mixed",
    summary: "Use AI to draft emails, social media posts, and short-form copy. Learn to treat AI output as a first draft you refine, not a finished product. Try Google Docs' built-in Gemini for a seamless writing experience.",
    task: "Ask your AI tool to draft 3 social media posts for a fictional small business (pick any niche). Edit each one to add your personal voice. Then open Google Docs and use the 'Help me write' (Gemini) feature to draft a short client welcome email.",
    tools: ["ChatGPT", "Gemini", "Google Docs"],
    whyItMatters: "Clients hire freelancers to handle content creation. Being able to produce quality drafts in minutes — across multiple formats — multiplies your value immediately.",
  },
  {
    day: 4, week: 1,
    title: "Canva Foundations — Your Design Home Base",
    category: "Design",
    summary: "Get comfortable in Canva: the canvas, templates, layers, and text tools. Understand the difference between elements, backgrounds, and frames.",
    task: "Create a free Canva account. Open a blank Instagram post template (1080×1080). Add a background color, a headline, and a logo placeholder. Export as PNG.",
    tools: ["Canva"],
    whyItMatters: "Canva is the most in-demand design tool for freelancers and VAs. Mastering it makes social media graphics, thumbnails, and presentations straightforward.",
  },
  {
    day: 5, week: 1,
    title: "Color & Font Basics — Why Design Looks Good",
    category: "Design",
    summary: "Learn the basics of color harmony (complementary, analogous, neutral palettes) and font pairing (one display + one body font). See how these choices affect brand feel.",
    task: "In Canva, create a simple 'brand board' using 3 colors and 2 fonts for a fictional brand. Use Coolors.co to generate the palette. Screenshot and save it.",
    tools: ["Canva", "Coolors.co", "Google Fonts"],
    whyItMatters: "Understanding basic design principles helps you make faster decisions and produce more professional-looking work for clients.",
  },
  {
    day: 6, week: 1,
    title: "AI Image Prompting — Creating Visuals with Text",
    category: "Graphics",
    summary: "Learn how to write prompts for AI image generators. Understand key terms: style, lighting, composition, mood. Use Canva Dream Lab for backgrounds and Ideogram 2.0 for images with readable text.",
    task: "In Canva, use Dream Lab to generate 4 different background images using detailed prompts — try one photorealistic and one illustrated style. Then go to Ideogram.ai and generate 1 image with readable text embedded (e.g. a poster with a headline).",
    tools: ["Canva Dream Lab", "Ideogram 2.0", "Adobe Firefly"],
    whyItMatters: "AI-generated images save hours of stock photo searching. Ideogram is especially useful because it renders readable text inside images — something most AI tools struggle with.",
  },
  {
    day: 7, week: 1,
    title: "Week 1 Mini-Project — Social Media Starter Pack",
    category: "Mixed",
    isMiniProject: true,
    summary: "Bring together everything from this week: prompting, copywriting, Canva design, and AI image generation. Include a vertical Reel/Story format alongside square posts — this is how clients actually post in 2026.",
    task: "Choose a fictional small business (café, coach, pet groomer). Use your AI tool to write 3 captions. Design 3 matching square Instagram posts AND 1 vertical Story (9:16) in Canva using Dream Lab images. Export all as a PDF or ZIP.",
    tools: ["ChatGPT", "Gemini", "Canva", "Canva Dream Lab"],
    whyItMatters: "This is exactly what a social media freelancer delivers to clients. You've just produced your first portfolio piece — and it includes both feed posts and Stories, which is what clients actually need.",
  },

  // ── WEEK 2: Graphics, Thumbnails & Presentation ──────────────────────────
  {
    day: 8, week: 2,
    title: "YouTube Thumbnails — What Makes People Click",
    category: "Graphics",
    summary: "Study the anatomy of a high-performing YouTube thumbnail: bold text, contrast, expressive face or clear subject, minimal clutter. Also design a vertical version for YouTube Shorts.",
    task: "Design a thumbnail for a fictional video 'My Top 5 Morning Habits' — bold, high-contrast, max 5 words. Then design a vertical version (1080×1920) for YouTube Shorts. Export both as PNG.",
    tools: ["Canva", "Ideogram 2.0"],
    whyItMatters: "Thumbnail design is one of the most in-demand and well-paid freelance micro-services. In 2026, creators need both horizontal and vertical formats.",
  },
  {
    day: 9, week: 2,
    title: "Background Removal & Image Editing",
    category: "Graphics",
    summary: "Learn to remove backgrounds and combine images using Canva's built-in tools. No extra apps needed — Canva's background remover is now free for most users.",
    task: "Use Canva's background remover to cut out an object or person and place the cut-out over 3 different backgrounds. Compare results and note which looks most professional.",
    tools: ["Canva"],
    whyItMatters: "Background removal is requested constantly for product images and social media. Canva's free built-in tool now covers 90% of client requests.",
  },
  {
    day: 10, week: 2,
    title: "Simple Brand Kits — What Goes Inside",
    category: "Design",
    summary: "Learn what a basic brand kit contains: logo variations, color palette, fonts, and usage guidelines. Build one in Canva.",
    task: "Build a simple brand kit document in Canva for a fictional brand. Include: color palette (with hex codes), 2 font choices, a text-based logo concept, and a simple do/don't usage guide.",
    tools: ["Canva", "Coolors.co"],
    whyItMatters: "Brand kit creation is a premium freelance service that underpins all design work. Every business needs one — it's a high-value, repeatable deliverable.",
  },
  {
    day: 11, week: 2,
    title: "Presentation Slides — Structure Before Design",
    category: "Design",
    summary: "Learn slide hierarchy: title, section, content, and CTA slides. Use Gamma.app to generate an AI-first draft and compare it to building manually.",
    task: "Use your AI tool to outline a 10-slide presentation on 'How Small Businesses Can Use AI'. Then use Gamma.app to generate the full deck from that outline in under 5 minutes. Compare the Gamma output to a slide you build manually in Canva.",
    tools: ["ChatGPT", "Gemini", "Gamma.app", "Canva"],
    whyItMatters: "Executives and coaches always need polished decks. Gamma.app is the 2026 standard for rapid deck creation — knowing both AI-generated and manual workflows makes you versatile.",
  },
  {
    day: 12, week: 2,
    title: "AI-Assisted Slide Design — Speed Without Sacrifice",
    category: "Design",
    summary: "Use Canva's Magic Studio to speed up slide creation. Learn when to trust the AI suggestion and when to override it with manual polish.",
    task: "Take 3 slides from yesterday's deck and redesign them using Canva's Magic Studio suggestions. For each slide, accept the AI suggestion and then make one deliberate manual improvement on top of it.",
    tools: ["Canva", "Gamma.app"],
    whyItMatters: "Speed is profit for a freelancer. The hybrid workflow — AI for structure, manual polish for quality — is what separates good deliverables from great ones.",
  },
  {
    day: 13, week: 2,
    title: "Logo Basics with AI — Simple Marks That Work",
    category: "Design",
    summary: "Learn what makes a functional logo: simplicity, scalability, and recognition. Use AI tools to generate concepts and clean one up in Canva.",
    task: "Use Looka.com to generate 3 logo concepts for a fictional brand. Pick the strongest, then recreate a simplified version using only Canva text and shape elements. Export as PNG.",
    tools: ["Looka", "Canva", "Ideogram 2.0"],
    whyItMatters: "Offering logo concept services adds significant revenue to projects. AI tools let you produce polished starting points fast — your job is to guide and refine.",
  },
  {
    day: 14, week: 2,
    title: "Week 2 Mini-Project — Creator Media Kit",
    category: "Mixed",
    isMiniProject: true,
    summary: "Combine graphics, brand elements, and copywriting into a media kit — one of the most requested deliverables for content creators.",
    task: "Create a 4-page Canva media kit for a fictional YouTube creator. Include: bio page, content stats, brand aesthetic page, and rates/contact page. Use AI for all copy and Dream Lab for imagery.",
    tools: ["ChatGPT", "Gemini", "Canva", "Canva Dream Lab"],
    whyItMatters: "Media kits are high-value deliverables for content creators. This project combines writing, design, and brand thinking — a strong portfolio piece.",
  },

  // ── WEEK 3: Automation, Workflow & AI Assistants ─────────────────────────
  {
    day: 15, week: 3,
    title: "What Is Automation? — No Fear Introduction",
    category: "Automation",
    summary: "Learn about triggers, actions, and workflows. Explore both Zapier (industry standard) and n8n (free open-source alternative) to understand what's possible.",
    task: "Browse the Zapier and n8n template libraries. Identify 3 automations that could save a small business real time. Write a plain-English explanation of how each one works.",
    tools: ["Zapier", "n8n"],
    whyItMatters: "Automation skills let you offer 'set it and forget it' solutions to clients. n8n is free at any scale — ideal for freelancers managing client automations without ongoing costs.",
  },
  {
    day: 16, week: 3,
    title: "Your First Zap — Email to Spreadsheet",
    category: "Automation",
    summary: "Connect apps so they work together automatically. Build your first real automation and explore Zapier's AI Actions feature.",
    task: "Build a Zap: Gmail trigger (new email with a specific label) → Google Sheets action (add a new row with sender, subject, and date). Then explore adding a Zapier AI Action step that summarizes the email content before logging it.",
    tools: ["Zapier", "Gmail", "Google Sheets"],
    whyItMatters: "This is the foundation of client lead tracking. The AI Action step shows how modern automations don't just move data — they understand it.",
  },
  {
    day: 17, week: 3,
    title: "Social Media Scheduling — Set It Up Once",
    category: "Automation",
    summary: "Batch and schedule social media content using Buffer or Later. Buffer covers 3 channels on the free plan — Later is better for single-profile management.",
    task: "Use your AI tool to generate 7 days of captions for a fictional business. Schedule them in Buffer or Later with appropriate times and hashtags.",
    tools: ["Buffer", "Later", "Canva", "ChatGPT", "Gemini"],
    whyItMatters: "Clients want content managed consistently without being involved daily. Scheduling tools are the entry point for social media management retainers.",
  },
  {
    day: 18, week: 3,
    title: "AI Meeting Notes & Task Capture",
    category: "Automation",
    summary: "Use AI meeting tools to automatically capture notes, action items, and follow-ups. One of the most practical day-to-day skills for VAs and executive assistants.",
    task: "Set up a free Fathom account and record a mock 5-minute 'client meeting'. Review the auto-generated summary and action items. Then use your AI tool to turn the action items into a formatted follow-up email.",
    tools: ["Fathom", "Otter.ai", "Gemini", "Google Docs"],
    whyItMatters: "VAs who support executives need flawless meeting documentation. AI meeting notes ensure nothing falls through the cracks and make you look hyper-professional from day one.",
  },
  {
    day: 19, week: 3,
    title: "Research with AI — Faster Client Prep",
    category: "Mixed",
    summary: "Use Perplexity AI as your research engine — it cites sources, making fact-checking fast. Then use your writing AI to rewrite findings in a client's brand voice.",
    task: "Pick a niche (e.g. sustainable fashion, pet care, B2B SaaS). Use Perplexity AI to research: target audience, 3 competitors, and 5 trending topics. Use your AI writing tool to turn the findings into a 1-page 'Content Strategy Brief'.",
    tools: ["Perplexity AI", "ChatGPT", "Gemini", "Google Docs"],
    whyItMatters: "Freelancers who can rapidly synthesize industry information become strategic partners. Perplexity is the best research tool because every claim links to a source.",
  },
  {
    day: 20, week: 3,
    title: "Build Your First Custom AI Assistant",
    category: "Mixed",
    summary: "Create a persistent AI assistant with a custom persona, tone, and instructions — using ChatGPT's Custom GPTs or Gemini Gems. This is a packageable client service.",
    task: "Build a Custom GPT (global users) or Gemini Gem (HK users) that acts as a social media assistant for a specific niche. Give it a name, a persona, and 5 specific instructions. Test it with 3 prompts and note how it responds differently from a standard chat.",
    tools: ["ChatGPT", "Gemini Gems"],
    whyItMatters: "Custom AI assistants are a sellable service — you can build one for a client as a standalone deliverable worth $100–250. They also make your own workflow dramatically faster.",
  },
  {
    day: 21, week: 3,
    title: "Week 3 Mini-Project — Automated Client Welcome System",
    category: "Automation",
    isMiniProject: true,
    summary: "Build an intake form that triggers an automated welcome email and logs the submission — a real, deployable client deliverable.",
    task: "Set up: Google Forms (3-field intake form) → Zapier automation → Gmail (auto welcome email) + Google Sheets (log submission). Test it end-to-end with a real form submission.",
    tools: ["Google Forms", "Zapier", "Gmail", "Google Sheets"],
    whyItMatters: "This is a real system you can deploy for any client tomorrow. It demonstrates you can connect tools — a clear step up from simply using AI to write things.",
  },

  // ── WEEK 4: Client-Style Practice Projects ───────────────────────────────
  {
    day: 22, week: 4,
    title: "Understanding Client Briefs",
    category: "Mixed",
    summary: "Learn how to interpret what clients really need, not just what they say. Practice writing clarifying questions and converting vague requests into a Scope of Work.",
    task: "Write a fictional vague client brief (e.g. 'I need some social media stuff done'). Use AI to help write 5 clarifying questions. Then rewrite the brief as a proper Scope of Work with deliverables and timeline.",
    tools: ["ChatGPT", "Gemini", "Google Docs"],
    whyItMatters: "Strong intake skills lead to better reviews and fewer revisions. The ability to turn vague requests into clear briefs is what separates a professional from a hobbyist.",
  },
  {
    day: 23, week: 4,
    title: "Full Social Media Package — Client Simulation",
    category: "Graphics",
    summary: "Work through a full client-style deliverable set, including carousel posts — the highest-reach format on Instagram and LinkedIn in 2026.",
    task: "For a fictional plant shop, produce: 4 square Instagram posts (design + caption), 1 multi-slide carousel post (5 slides with care tips), and 1 Story frame. Keep all designs consistent with a simple brand palette.",
    tools: ["Canva", "Canva Dream Lab", "ChatGPT", "Gemini"],
    whyItMatters: "This is the core deliverable of a social media freelancer. Carousel posts have the highest organic reach in 2026 — clients who don't know this will thank you for including one.",
  },
  {
    day: 24, week: 4,
    title: "Rendering Basics — Export Settings",
    category: "Rendering",
    summary: "Understand when to use PNG, JPG, PDF, SVG, GIF, or MP4. Know what clients mean when they ask for 'print quality' vs 'web quality'.",
    task: "Export one Canva design in 4 different formats. Compare file size, quality, and appropriate use case. Document your findings in a simple reference table you can share with future clients.",
    tools: ["Canva"],
    whyItMatters: "Sending the right format for the right use case makes you the expert in the room. Sending the wrong format wastes everyone's time.",
  },
  {
    day: 25, week: 4,
    title: "AI Image Upscaling & Quality Enhancement",
    category: "Rendering",
    summary: "Learn to upscale low-resolution images using AI. Adobe Enhance (free in browser) now handles most cases without any software install.",
    task: "Take 3 low-resolution images. Run each through Adobe Enhance (photoshop.adobe.com) and Upscale.media. Compare before/after quality and document when you'd use each tool.",
    tools: ["Adobe Enhance", "Upscale.media"],
    whyItMatters: "Clients constantly provide low-quality images. Being able to rescue them professionally — without expensive software — is a genuine skill clients appreciate.",
  },
  {
    day: 26, week: 4,
    title: "Building Your Services Menu",
    category: "Mixed",
    summary: "Define your service offerings and set starter pricing. Include 2026-relevant services like AI meeting notes, custom AI assistants, and Canva template setup.",
    task: "Use your AI tool to brainstorm and write 5–7 services with descriptions and starter prices. Format the final version as a clean 1-page PDF in Canva. Include at least one AI-specific service (e.g. 'Custom AI Assistant Setup — $150').",
    tools: ["ChatGPT", "Gemini", "Canva"],
    whyItMatters: "Clear services turn skills into income. Having at least one AI-specific service on your menu signals you're ahead of the curve and often commands higher rates.",
  },
  {
    day: 27, week: 4,
    title: "Portfolio Setup — Showing Your Work",
    category: "Mixed",
    summary: "Present your mock projects as portfolio pieces. A public Notion page is the 2026 standard — faster than a website and easy to update.",
    task: "Create a portfolio page using Notion (free, shareable link) or Canva (export as PDF). Showcase 3–5 pieces from this course with a brief description of what you made and which tools you used.",
    tools: ["Canva", "Notion", "Google Sites"],
    whyItMatters: "Evidence of work is your most important sales tool. A Notion portfolio takes 30 minutes to set up and looks professional immediately.",
  },
  {
    day: 28, week: 4,
    title: "Week 4 Mini-Project — Full Client Package",
    category: "Mixed",
    isMiniProject: true,
    summary: "Simulate taking on a new client from brief to delivery — your Level 1 capstone.",
    task: "Create a complete deliverable set for a fictional yoga studio: (1) brand kit (colors, fonts, logo concept), (2) 5 Instagram posts with captions, (3) 1 YouTube thumbnail, (4) a 3-email welcome sequence written with AI, and (5) a 15-second Reel storyboard. Deliver everything in a named folder structure.",
    tools: ["ChatGPT", "Gemini", "Canva", "Canva Dream Lab", "Zapier", "Google Drive"],
    whyItMatters: "Completing this proves you can handle end-to-end client work — from brand identity to content to delivery. This is your strongest portfolio piece.",
  },
];

// ─────────────────────────────────────────────
// WEEK OVERVIEWS
// ─────────────────────────────────────────────

export const weekOverviews: WeekOverview[] = [
  {
    week: 1,
    title: "AI Basics & Your First Designs",
    color: "#4f98a3",
    outcomes: [
      "Write effective prompts using role + context + format",
      "Use Gemini and ChatGPT confidently (with HK alternatives noted)",
      "Create Canva social graphics from scratch",
      "Generate AI images with Dream Lab and Ideogram",
      "Deliver a social starter pack with Stories format",
    ],
  },
  {
    week: 2,
    title: "Graphics, Thumbnails & Presentations",
    color: "#7a5fc0",
    outcomes: [
      "Design YouTube thumbnails in horizontal and vertical formats",
      "Remove backgrounds using Canva's built-in free tool",
      "Build a brand kit with colors, fonts, and logo concept",
      "Generate AI-first slide decks with Gamma.app",
      "Deliver a creator media kit",
    ],
  },
  {
    week: 3,
    title: "Automation, Workflow & AI Assistants",
    color: "#c07a2f",
    outcomes: [
      "Understand triggers and actions in Zapier and n8n",
      "Build your first working Zap",
      "Schedule social content with Buffer or Later",
      "Capture AI meeting notes with Fathom",
      "Build a Custom GPT or Gemini Gem for a specific niche",
      "Deliver a working automated client welcome system",
    ],
  },
  {
    week: 4,
    title: "Client-Ready Practice Projects",
    color: "#2f8c5c",
    outcomes: [
      "Interpret client briefs and write clarifying questions",
      "Deliver a full social media package with carousels",
      "Upscale images professionally with Adobe Enhance",
      "Write a services menu with 2026-relevant AI offerings",
      "Build a portfolio page in Notion or Canva",
      "Complete a full end-to-end client simulation",
    ],
  },
];

// ─────────────────────────────────────────────
// SYSTEMS SUMMARY
// ─────────────────────────────────────────────

export const systemsSummary = [
  {
    week: 1,
    title: "Foundations & Prompting",
    systems: [
      "Role + Context + Task + Format prompt framework",
      "Tone & Persona Modulation",
      "Fact-Checking AI Outputs",
      "HK region-aware tool selection (Gemini first)",
      "Chat Thread Organization",
    ],
  },
  {
    week: 2,
    title: "AI Visual Basics",
    systems: [
      "Dream Lab & Ideogram text-to-image prompting",
      "Basic Canva Layout SOP",
      "Aspect Ratio & Format Guide (square, vertical, 16:9)",
      "Background Removal with Canva built-in",
      "Gamma.app rapid deck generation workflow",
    ],
  },
  {
    week: 3,
    title: "Automation & AI Assistants",
    systems: [
      "Zapier trigger-action workflow SOP",
      "AI Meeting Notes workflow (Fathom → action items → email)",
      "Social Scheduling SOP (Buffer / Later)",
      "Custom GPT / Gemini Gem setup process",
      "Research Synthesis SOP (Perplexity → AI rewrite)",
    ],
  },
  {
    week: 4,
    title: "Freelance Fundamentals",
    systems: [
      "Client Brief Interpretation & Clarifying Questions SOP",
      "Deliverable Handoff SOP (folder naming, export formats)",
      "Services Menu Structure with AI-specific offerings",
      "Portfolio Content Mapping",
      "End-to-end client simulation checklist",
    ],
  },
];

// ─────────────────────────────────────────────
// METRICS TO TRACK
// ─────────────────────────────────────────────

export const metricsToTrack = [
  {
    metric: "Prompt Accuracy",
    why: "Measure how often the AI gives you exactly what you need on the first try. Track this to improve your prompting system over time.",
  },
  {
    metric: "Task Speed-up",
    why: "Monitor how much faster you complete writing and design tasks with AI versus manually. This is your core selling point to clients.",
  },
  {
    metric: "Learning Consistency",
    why: "Track your daily streak to ensure foundational habits are forming. Consistency at Level 1 predicts success at Level 2.",
  },
  {
    metric: "Portfolio Pieces Completed",
    why: "Count the deliverables you've built. Every piece is evidence you can show a prospective client.",
  },
];

// ─────────────────────────────────────────────
// STARTER TOOLKIT
// Imported by toolkit.tsx — do not remove this export.
// Tool 'name' values must match keys in useRegion.ts BLOCKED_TOOLS /
// TOOL_ALTERNATIVES so region-lock warnings render correctly.
// ─────────────────────────────────────────────

export const starterToolkit: ToolkitItem[] = [

  // ── AI Writing & Chat ──────────────────────────────────────────────────────
  {
    name: "Gemini",
    url: "https://gemini.google.com",
    category: "AI Writing",
    desc: "Google's AI assistant — primary recommendation for Hong Kong users. Google recently opened direct HK access. Great for writing, research, and built natively into Google Docs.",
  },
  {
    name: "ChatGPT",
    url: "https://chat.openai.com",
    category: "AI Writing",
    desc: "Primary AI writing and research assistant for global users. Note: geo-blocked in HK — use Gemini instead.",
  },
  {
    name: "Perplexity AI",
    url: "https://perplexity.ai",
    category: "AI Writing",
    desc: "AI-powered research tool that cites its sources. Best for fact-checking, competitor research, and building content briefs before writing.",
  },
  {
    name: "DeepSeek",
    url: "https://chat.deepseek.com",
    category: "AI Writing",
    desc: "Free, capable AI assistant. Best backup for HK and CN users. Strong at reasoning and long-form content.",
  },

  // ── Design & Graphics ─────────────────────────────────────────────────────
  {
    name: "Canva",
    url: "https://canva.com",
    category: "Design & Graphics",
    desc: "All-in-one design platform. Free tier covers all of Level 1. Use Dream Lab for AI image generation and Magic Studio for one-click enhancements.",
  },
  {
    name: "Adobe Firefly",
    url: "https://firefly.adobe.com",
    category: "Design & Graphics",
    desc: "Commercial-safe AI image generation. Available free in the Photoshop web app — no desktop install required.",
  },
  {
    name: "Ideogram 2.0",
    url: "https://ideogram.ai",
    category: "Design & Graphics",
    desc: "Best free AI image generator for text-in-images. Essential when readable text needs to be part of the image.",
  },
  {
    name: "Looka",
    url: "https://looka.com",
    category: "Design & Graphics",
    desc: "AI logo generator. Produces polished logo concepts fast — use for ideation, then refine in Canva.",
  },
  {
    name: "Coolors",
    url: "https://coolors.co",
    category: "Design & Graphics",
    desc: "Generate harmonious color palettes for brand work. Free and instant.",
  },

  // ── Presentations ─────────────────────────────────────────────────────────
  {
    name: "Gamma.app",
    url: "https://gamma.app",
    category: "Presentations",
    desc: "AI-first presentation builder. Generate a polished deck from a single text prompt in under 2 minutes, then export to Canva or PowerPoint for refinement.",
  },

  // ── Productivity ──────────────────────────────────────────────────────────
  {
    name: "Google Workspace",
    url: "https://workspace.google.com",
    category: "Productivity",
    desc: "Docs, Sheets, Slides, Forms, Drive — the backbone of most client workflows. Gemini is now built into every app.",
  },
  {
    name: "Notion",
    url: "https://notion.so",
    category: "Productivity",
    desc: "Build your portfolio, organize your SOPs, and store your prompt library. A public Notion page is the fastest way to launch a freelance portfolio.",
  },
  {
    name: "Fathom",
    url: "https://fathom.video",
    category: "Productivity",
    desc: "AI meeting recorder. Auto-generates summaries and action items after every call. Free for personal use.",
  },

  // ── Automation ────────────────────────────────────────────────────────────
  {
    name: "Zapier",
    url: "https://zapier.com",
    category: "Automation",
    desc: "Connect apps and automate repetitive tasks. Now includes AI Actions — add an AI processing step inside any Zap.",
  },
  {
    name: "n8n",
    url: "https://n8n.io",
    category: "Automation",
    desc: "Free, open-source automation. No usage limits. Great for freelancers who want to manage client automations without ongoing subscription costs.",
  },

  // ── Social Media ──────────────────────────────────────────────────────────
  {
    name: "Buffer",
    url: "https://buffer.com",
    category: "Social Media",
    desc: "Schedule and manage social media posts. Free plan covers 3 channels.",
  },
  {
    name: "Later",
    url: "https://later.com",
    category: "Social Media",
    desc: "Social scheduling with a generous free plan for 1 profile. Better free-tier limits than Buffer for solo freelancers.",
  },

  // ── Image Enhancement ─────────────────────────────────────────────────────
  {
    name: "Adobe Enhance",
    url: "https://photoshop.adobe.com/en/features/enhance",
    category: "Image Editing",
    desc: "Free browser-based AI image upscaling. Rescues low-resolution client images without any software install.",
  },
];

// ─────────────────────────────────────────────
// PORTFOLIO TARGETS
// Imported by portfolio.tsx — do not remove this export.
// ─────────────────────────────────────────────

export const portfolioTargets: PortfolioTarget[] = [
  {
    title: "Social Media Starter Pack",
    week: 1,
    desc: "3 square Instagram posts + 1 vertical Story with AI-generated images and AI-written captions for a fictional business.",
  },
  {
    title: "YouTube Thumbnail Set",
    week: 2,
    desc: "1 horizontal thumbnail + 1 vertical YouTube Shorts thumbnail — bold, high-contrast, max 5 words of text.",
  },
  {
    title: "Brand Kit PDF",
    week: 2,
    desc: "Color palette (hex codes), 2 font choices, a logo concept, and a simple usage guide for a fictional brand.",
  },
  {
    title: "AI-Generated Slide Deck",
    week: 2,
    desc: "A 10-slide presentation generated via Gamma.app and refined in Canva — demonstrating the hybrid AI workflow.",
  },
  {
    title: "Creator Media Kit",
    week: 2,
    desc: "4-page Canva media kit: bio, content stats, brand aesthetic, and rates/contact page.",
  },
  {
    title: "Custom AI Assistant",
    week: 3,
    desc: "A Custom GPT or Gemini Gem built for a specific niche — named persona, 5 custom instructions, tested with 3 prompts.",
  },
  {
    title: "Automated Welcome Flow",
    week: 3,
    desc: "Google Form → Zapier → Gmail auto-welcome email + Google Sheets log. Fully tested end-to-end.",
  },
  {
    title: "Services Menu",
    week: 4,
    desc: "A 1-page Canva PDF listing 5–7 services with descriptions, starter prices, and at least one AI-specific offering.",
  },
  {
    title: "Full Client Simulation Package",
    week: 4,
    desc: "Brand kit + 5 social posts + carousel + thumbnail + 3-email sequence + Reel storyboard for a yoga studio — delivered in a named folder structure.",
  },
  {
    title: "Personal Portfolio Page",
    week: 4,
    desc: "A shareable Notion page or Canva PDF portfolio showing 3–5 pieces with tool credits and brief descriptions.",
  },
];
