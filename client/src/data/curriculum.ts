// =============================================================================
// AI Sprint — Accounting Level 1 (Basic) Curriculum
// 28-Day Program: Accounting Foundations + AI Workflows
// Course Title (catalogue): Mastering Accounting with AI Integrations
// Course Hero Headline (in-app): Accounting in the AI Era
// Updated: April 2026
// =============================================================================

export type Category = "Foundations" | "Bookkeeping" | "Reporting" | "Tax & Compliance" | "Controls & Ethics" | "Mixed";

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
  isOptionalSkip?: boolean; // Day 2 — experienced accountants can skip
  isCheckpoint?: boolean;   // Day 14 — Basic Level Complete milestone
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
// Basic Track: Days 1–14 (Foundations + Workflows)
// Advanced Track: Days 15–28 (Controls, Analytics, Advisory)
// ─────────────────────────────────────────────

export const curriculum: DayLesson[] = [

  // ── WEEK 1: AI Era, Foundations & Your Toolkit ───────────────────────────
  {
    day: 1, week: 1,
    title: "Accounting in the AI Era (2026)",
    category: "Foundations",
    summary: "Understand how AI is transforming accounting — from backward-looking bookkeeping toward real-time, predictive, and advisory roles. Explore where AI already sits in the accounting workflow: transaction coding, reconciliation, reporting, tax research, and fraud detection.",
    task: "List 3 repetitive tasks you do regularly that could be automated or AI-assisted (e.g. coding invoices, chasing missing receipts, writing variance commentary). For each task, write one sentence on what 'AI helping' would look like in practice.",
    tools: ["ChatGPT", "Claude", "Gemini"],
    whyItMatters: "AI isn't replacing accountants — it's replacing the low-judgement parts of the job. Understanding this shift is the first step to positioning yourself as the professional who manages AI, not the one it replaces.",
  },
  {
    day: 2, week: 1,
    title: "Core Accounting Refresh + First AI Prompt",
    category: "Foundations",
    isOptionalSkip: true,
    summary: "A fast refresher on journals, ledgers, trial balance, accruals, deferrals, and the three main financial statements — all framed through a cloud accounting system. Experienced accountants: skim the concept, then jump straight to the micro-task. This day also introduces your first accounting-specific AI prompt.",
    task: "Map each financial statement line item to its typical data source (e.g. Revenue → sales invoices, Receivables → AR ledger, Cash → bank feed). Then write your first AI prompt: ask your tool to explain the difference between an accrual and a deferral in plain English, as if explaining to a non-accountant client.",
    tools: ["ChatGPT", "Claude", "Gemini"],
    whyItMatters: "Every AI output in accounting is only as good as your ability to verify it against the fundamentals. This refresh also gives you your first taste of using AI to explain accounting concepts — one of the most immediately useful skills in client communication.",
  },
  {
    day: 3, week: 1,
    title: "Prompting for Accountants — The Core Skill",
    category: "Mixed",
    summary: "Learn the anatomy of an effective accounting prompt: role, context, task, format, and constraints. Understand why vague prompts produce unusable output — and how accountants specifically need to frame context (entity type, period, standard) to get reliable results.",
    task: "Write 5 prompts all asking AI to summarise a month-end variance. Each prompt should add one more layer of context: (1) no context, (2) add entity type, (3) add audience, (4) add format instruction, (5) add a constraint ('do not give tax advice'). Compare the 5 outputs and note the quality difference.",
    tools: ["ChatGPT", "Claude", "Gemini"],
    whyItMatters: "Prompting is the most transferable skill in this course. Every day from here uses it. A well-structured accounting prompt is the difference between a first draft you can use and one you have to rewrite from scratch.",
  },
  {
    day: 4, week: 1,
    title: "Your AI Toolkit for Accountants",
    category: "Mixed",
    summary: "Get hands-on with the actual AI tools used in accounting workflows in 2026: general AI assistants (ChatGPT, Claude, Gemini), AI-native accounting platforms (Xero, QuickBooks with AI features), and Microsoft Copilot in Excel. Understand what each tool is best suited for.",
    task: "Sign into or trial one accounting-adjacent AI tool you haven't used before (e.g. Xero's AI features, Copilot in Excel, or QuickBooks Assistant). Ask it one practical question — e.g. 'What does my current AR balance suggest about collection risk?' or 'Summarise the top 3 expense categories this month.' Note what it does well and where it falls short.",
    tools: ["ChatGPT", "Claude", "Gemini", "Microsoft Copilot", "Xero", "QuickBooks"],
    whyItMatters: "Knowing which tool to reach for — and why — saves time and avoids errors. Not all AI tools are equal in an accounting context; some lack the financial controls you need.",
  },
  {
    day: 5, week: 1,
    title: "The Modern Accounting Tech Stack",
    category: "Foundations",
    summary: "Understand how cloud ERPs, OCR invoice capture, AP/AR automation, bank feeds, and expense tools connect — and where AI layers on top. See how data flows from source document to financial statement in a modern stack.",
    task: "Draw a simple diagram (pen and paper, Canva, or Google Slides) of your current finance tech stack. Mark in green where AI already exists, yellow where it could be added, and red where everything is still manual. Take a photo or export and save it — you'll revisit this on Day 14.",
    tools: ["Xero", "QuickBooks", "Dext", "Hubdoc", "Microsoft Copilot"],
    whyItMatters: "You can't improve what you can't see. Mapping your stack makes it obvious where the highest-value AI interventions are — and gives you a clear story to tell a manager, client, or employer.",
  },
  {
    day: 6, week: 1,
    title: "AI-Powered Bookkeeping & Transaction Coding",
    category: "Bookkeeping",
    summary: "Learn how AI categorises transactions, suggests GL codes, and learns from corrections. Understand the 'AI suggests, human approves' model — and what makes a good review workflow.",
    task: "Design a review checklist for AI-suggested transaction categories. Include at least 5 rules (e.g. 'Flag any transaction over $X for manual review', 'Reject any auto-code to a balance sheet account without a memo', 'Review all new vendor names on first appearance'). Format it as a table with Rule, Why, and Action columns.",
    tools: ["Xero", "QuickBooks", "ChatGPT", "Claude"],
    whyItMatters: "AI bookkeeping tools are only as reliable as the review process behind them. Your checklist becomes an SOP — a real, deployable artefact that controls AI risk in your workflow.",
  },
  {
    day: 7, week: 1,
    title: "Week 1 Mini-Project — Your AI-Ready Finance Stack Map",
    category: "Mixed",
    isMiniProject: true,
    summary: "Bring together the week's learning: the AI landscape, your prompting skills, your toolkit, and your tech stack knowledge. Produce a clean, shareable one-page summary of how AI fits into your accounting role today.",
    task: "Create a one-page 'AI Readiness Snapshot' document (Google Docs or Word). Include: (1) your 3 highest-value automation opportunities from Day 1, (2) your updated tech stack diagram from Day 5, (3) the 3 AI tools you found most relevant this week and why, (4) one accounting prompt you're proud of from Day 3. This is your first portfolio piece.",
    tools: ["ChatGPT", "Claude", "Gemini", "Google Docs"],
    whyItMatters: "This document is real and shareable. It demonstrates AI literacy to an employer or client, and gives you a baseline to measure your progress against when you complete Day 28.",
  },

  // ── WEEK 2: Core Workflows with AI ───────────────────────────────────────
  {
    day: 8, week: 2,
    title: "Data Quality — The Foundation of Good AI Output",
    category: "Bookkeeping",
    summary: "Understand why clean chart of accounts, structured vendor master data, and consistent description fields are the difference between useful AI output and garbage. Garbage in, garbage out applies nowhere more than in accounting AI.",
    task: "Identify 5 data fields in your accounting system that are inconsistently populated or poorly structured (e.g. free-text memo field, multiple names for the same vendor, blank cost centre codes). For each, write what 'good data' looks like and draft one AI prompt that would help you clean or standardise it.",
    tools: ["ChatGPT", "Claude", "Gemini", "Excel / Google Sheets"],
    whyItMatters: "AI tools amplify the quality of your underlying data. Fixing messy data before deploying AI is one of the most valuable things an accountant can do — and it's a skill that's in short supply.",
  },
  {
    day: 9, week: 2,
    title: "AI and Bank Reconciliations",
    category: "Bookkeeping",
    summary: "Learn how AI matches entries, spots missing items, flags duplicate payments, and highlights timing differences. Understand what reconciliation anomalies look like and how to prompt AI to surface them.",
    task: "Write 3 rules or AI prompts you would use to highlight reconciliation mismatches. Examples: 'Flag any bank transaction with no matching invoice within 3 days', 'List all round-number payments over $500 with no supporting memo', 'Identify payments to the same vendor twice in the same week.' Format as a numbered prompt list you could hand to a colleague.",
    tools: ["ChatGPT", "Claude", "Xero", "QuickBooks"],
    whyItMatters: "Bank reconciliation is one of the first accounting tasks AI genuinely accelerates. Understanding the rules behind it means you can configure — and audit — the AI, rather than just accepting its output.",
  },
  {
    day: 10, week: 2,
    title: "Documents and AI — Invoices, Contracts & Receipts",
    category: "Bookkeeping",
    summary: "Learn how AI uses OCR to read invoices, contracts, and receipts, extract key data fields, and apply rules for accounting treatment. Understand the limits of document AI and where human review is essential.",
    task: "Define the minimum data fields an AI should extract from an invoice for it to be bookkeeping-ready. Include: date, vendor name, vendor tax ID, line items, amounts, tax, PO reference, payment terms, and currency. Then write a prompt that instructs an AI to extract these fields from an invoice and flag any that are missing or ambiguous.",
    tools: ["Dext", "Hubdoc", "ChatGPT", "Claude"],
    whyItMatters: "Document AI is one of the highest-ROI tools in accounting — it eliminates manual data entry. But knowing exactly what to extract (and what to check) is the difference between a useful automation and one that creates errors downstream.",
  },
  {
    day: 11, week: 2,
    title: "Month-End Close with AI Assistance",
    category: "Reporting",
    summary: "Learn how AI accelerates month-end: automated close checklists, reminder workflows, variance explanation drafts, and status tracking. Understand where AI adds speed and where professional judgement remains essential.",
    task: "Draft a 5-step AI-assisted month-end close checklist. Each step should specify: what the AI does, what the human reviews, and the sign-off requirement. Example Step 1: 'Ask AI to compare revenue by category vs last month and highlight variances over 10% — human reviews each flag and adds explanation note.'",
    tools: ["ChatGPT", "Claude", "Gemini", "Excel / Google Sheets", "Xero"],
    whyItMatters: "Month-end close is the highest-pressure recurring workflow in accounting. AI can compress a 3-day close to a 1-day close — but only if the workflow is designed well. This checklist is a real SOP you can deploy or show in an interview.",
  },
  {
    day: 12, week: 2,
    title: "AI in Tax and Compliance — A Safe Introduction",
    category: "Tax & Compliance",
    summary: "Understand how to use AI for tax research and compliance preparation — and equally importantly, where NOT to use it. AI can summarise rules and surface relevant guidance, but it cannot replace professional judgement or sign off on advice.",
    task: "Draft a prompt that asks AI to summarise the key steps in one tax process relevant to your work (e.g. VAT filing, payroll tax submission, year-end corporation tax prep). The prompt must instruct AI to: (1) summarise the process, (2) list the key deadlines, and (3) identify the official sources a human should verify against. Save the output and note any errors or gaps.",
    tools: ["ChatGPT", "Claude", "Perplexity AI"],
    whyItMatters: "Tax is the area where AI errors carry the most risk. Learning to use it as a research accelerator — not an advisor — keeps you on the right side of professional standards while still saving time.",
  },
  {
    day: 13, week: 2,
    title: "Client & Stakeholder Communication with AI",
    category: "Reporting",
    summary: "Learn to use AI to draft professional accounting communications: management commentary, board summaries, client variance emails, and process documentation — while preserving your professional voice and judgement.",
    task: "Take a set of raw variance bullets (you can make these up: 'Revenue up 12% — new customer X', 'Wages up 8% — two new hires in March', 'Travel down 40% — no client trips this quarter') and write a prompt specification for turning them into a short management commentary. Specify tone (professional, concise), audience (non-finance board member), length (150 words max), and one thing the AI must NOT do (e.g. draw conclusions about future performance).",
    tools: ["ChatGPT", "Claude", "Gemini", "Google Docs"],
    whyItMatters: "Clear, AI-assisted communication is one of the fastest ways to elevate your professional profile. Accountants who can translate numbers into readable narrative are in high demand — AI gets you to a strong first draft in minutes.",
  },
  {
    day: 14, week: 2,
    title: "🎉 Basic Level Complete — Your AI-Ready Accounting Workflow",
    category: "Mixed",
    isMiniProject: true,
    isCheckpoint: true,
    summary: "Bring together everything from the first 14 days into a single AI-assisted workflow map and a shareable personal summary. This is your Basic Level capstone — and your foundation for the Advanced track.",
    task: "Sketch a 5-box flowchart of your ideal AI-assisted accounting month: Bookkeeping → Reconciliation → Close → Reporting → Communication. For each box, note: one AI tool you'd use, one human review point, and one risk to watch. Then write a 3-sentence reflection: what surprised you most, what you'll use immediately, and what you want to explore in the Advanced track. Share in the community if you'd like feedback.",
    tools: ["ChatGPT", "Claude", "Gemini", "Google Docs", "Canva"],
    whyItMatters: "You've built a real, deployable set of tools over the past 14 days: a review checklist, a reconciliation ruleset, a close SOP, a communication framework, and a prompt library. The flowchart makes it visible — and shareable. Completing this is a genuine career asset.",
  },

  // ── WEEK 3: Advanced Track — Controls, Analytics & Advisory ─────────────
  {
    day: 15, week: 3,
    title: "From Automation to Assurance — Where Humans Stay in Charge",
    category: "Controls & Ethics",
    summary: "Understand the boundary between what can be automated and where professional judgement is critical — revenue recognition, estimates, provisioning, going concern. Learn the concept of 'AI-assisted, human-signed' as a professional standard.",
    task: "Review 5 accounting areas and classify each as: (A) Safe to automate, (B) AI-assisted with mandatory human review, or (C) Human decision only. Examples: transaction coding, depreciation calculation, provision for doubtful debts, payroll tax filing, revenue recognition for a multi-element contract. Write a one-sentence rationale for each classification.",
    tools: ["ChatGPT", "Claude"],
    whyItMatters: "Knowing where AI ends and your professional responsibility begins is not optional — it's part of your duty of care. This framework protects you and your clients.",
  },
  {
    day: 16, week: 3,
    title: "Advanced Anomaly and Fraud Detection",
    category: "Controls & Ethics",
    summary: "Learn how AI identifies unusual transactions, patterns suggesting fraud or control weaknesses, and how to investigate flagged items. Understand both the power and the limitations of AI fraud screening.",
    task: "Draft 3 specific anomaly detection triggers you would configure in an AI fraud-screen for your organisation. Examples: 'Flag all invoices ending in .00 over $1,000', 'Highlight any vendor created and paid in the same week', 'Alert on any journal posted after 7pm or on a weekend'. For each trigger, note the fraud risk it addresses.",
    tools: ["ChatGPT", "Claude", "Xero", "QuickBooks"],
    whyItMatters: "AI fraud detection is now standard in mid-market accounting systems. Understanding how to configure and interpret it — rather than just switch it on — makes you the expert in the room when a flag fires.",
  },
  {
    day: 17, week: 3,
    title: "AI in Financial Reporting and Disclosures",
    category: "Reporting",
    summary: "Learn to use AI to produce first drafts of notes, disclosures, and MD&A-style commentary, with cross-references to accounting standards. Understand the review process that turns an AI draft into a signed deliverable.",
    task: "Create a reusable prompt template for AI to draft a disclosure note. The template should take as inputs: the relevant accounting policy, the key numbers, and the applicable standard reference. Output should be a draft note in professional language. Test your template on one disclosure area (e.g. leases, related parties, or revenue recognition).",
    tools: ["ChatGPT", "Claude", "Gemini"],
    whyItMatters: "Disclosure writing is time-consuming and templated — exactly the kind of task AI handles well. A reusable prompt template is a genuine productivity tool you can use or share with your team immediately.",
  },
  {
    day: 18, week: 3,
    title: "Estimates, Provisions and Judgement Areas",
    category: "Reporting",
    summary: "Learn how to use AI to structure evidence, scenarios, and pros/cons for accounting estimates — without letting AI make the judgement call. Covers allowances, provisions, impairment indicators, and useful life assumptions.",
    task: "Write a prompt that asks AI to help you build the case for a proposed provision. The prompt should instruct AI to: (1) list the key assumptions required, (2) identify the main risks to each assumption, (3) suggest a range of outcomes (best / base / worst case), and (4) flag which accounting standard applies. Do NOT ask AI to tell you the right answer — ask it to help you think.",
    tools: ["ChatGPT", "Claude"],
    whyItMatters: "Provisions and estimates are where auditors focus — and where careers are made or broken. Using AI to structure your thinking (not replace it) produces better-documented, more defensible judgements.",
  },
  {
    day: 19, week: 3,
    title: "AI in Audits and Audit Readiness",
    category: "Controls & Ethics",
    summary: "Understand how auditors in 2026 use AI for testing, sampling, and analytics — and what clients need to provide. Learn to think like an auditor when designing your AI-assisted workflows.",
    task: "Draft a checklist of AI-generated evidence you would keep for auditors. For each item, note: what was produced, who reviewed it, when, and what the input prompt or configuration was. Include at least 5 items covering: a reconciliation output, a variance analysis, a disclosure draft, a transaction anomaly flag, and a journal entry summary.",
    tools: ["ChatGPT", "Claude", "Excel / Google Sheets"],
    whyItMatters: "Auditors increasingly ask 'show me your AI' — they want to see prompts, outputs, review sign-offs, and change logs. Building this habit now puts you years ahead of most finance teams.",
  },
  {
    day: 20, week: 3,
    title: "AI-Driven Reconciliations at Scale",
    category: "Bookkeeping",
    summary: "Learn to scale reconciliation workflows across multiple entities, currencies, systems, and periods using AI and automation tools. Move from single-entity thinking to group-level efficiency.",
    task: "Define 3 performance KPIs for an AI-assisted reconciliation process. For each KPI, specify: what it measures, how you would calculate it, and what a good target looks like. Examples: average time to reconcile per entity, error rate on AI-suggested matches, number of items escalated to human review per period.",
    tools: ["ChatGPT", "Claude", "Excel / Google Sheets", "Xero"],
    whyItMatters: "Scalability is the real value proposition of AI in reconciliation. If you can define what good looks like — and measure it — you can make the business case for investing in better tooling.",
  },
  {
    day: 21, week: 3,
    title: "Week 3 Mini-Project — AI Workflow Audit",
    category: "Mixed",
    isMiniProject: true,
    summary: "Apply the advanced track thinking to a real or realistic accounting workflow. Identify where AI is being used well, where it's creating risk, and where it's missing entirely.",
    task: "Choose one end-to-end accounting process (e.g. purchase-to-pay, month-end close, or payroll). Map the current workflow in 6–8 steps. For each step, assess: Is AI used? Should it be? What is the control point? What could go wrong? Produce a one-page 'AI Workflow Audit' document — this is portfolio piece number two.",
    tools: ["ChatGPT", "Claude", "Google Docs", "Canva"],
    whyItMatters: "An AI Workflow Audit is a real consulting deliverable. Finance teams pay for exactly this kind of structured assessment. Completing one — even on a fictional process — demonstrates genuine advisory capability.",
  },

  // ── WEEK 4: Advisory, Governance & Capstone ──────────────────────────────
  {
    day: 22, week: 4,
    title: "FP&A — Forecasting and Scenario Analysis with AI",
    category: "Reporting",
    summary: "Use AI to generate baseline forecasts, build scenario narratives, and run sensitivity analysis from historical data. Understand the difference between AI as a calculation engine and AI as a thinking partner.",
    task: "Craft a prompt that asks AI to build a 'best case / base case / worst case' revenue narrative for a fictional business. Provide it with: last year's revenue by quarter, one known positive factor, and one known risk. Evaluate the output: is the logic sound? Are the assumptions stated? Would you sign off on this for a board pack?",
    tools: ["ChatGPT", "Claude", "Gemini", "Excel / Google Sheets"],
    whyItMatters: "Scenario analysis is one of the most valued skills in finance — and one of the most time-consuming. AI doesn't replace the judgement but it dramatically compresses the drafting time.",
  },
  {
    day: 23, week: 4,
    title: "Cost Analysis and Profitability Insights",
    category: "Reporting",
    summary: "Use AI to review cost allocation, analyse profitability by segment, and surface margin trends. Learn to structure your data inputs so AI can produce meaningful output.",
    task: "Define the exact data fields you would feed an AI tool to analyse profitability by product or customer. Include: revenue fields, direct cost fields, allocated overhead basis, time period, and comparison period. Then write the prompt you would use to ask for a plain-English summary of the top 3 margin insights.",
    tools: ["ChatGPT", "Claude", "Excel / Google Sheets"],
    whyItMatters: "Profitability analysis by segment is one of the highest-value things a finance team produces — and most teams do it slowly or not at all. AI makes it fast enough to run monthly instead of annually.",
  },
  {
    day: 24, week: 4,
    title: "Policy Automation and Workflow Design",
    category: "Controls & Ethics",
    summary: "Learn to translate accounting policies into explicit rules, checklists, and IF-THEN logic that AI tools and bots can follow. This is the bridge between your accounting knowledge and a working automation.",
    task: "Take a short accounting policy (e.g. capitalisation threshold: 'Assets over $1,000 with a useful life over 12 months are capitalised; below this, expense immediately'). Break it into explicit IF-THEN rules that an AI or automation tool could apply. Aim for at least 5 rules covering the main scenarios including edge cases.",
    tools: ["ChatGPT", "Claude"],
    whyItMatters: "The ability to translate policy into machine-readable logic is a rare and valuable skill. It's the foundation of any accounting automation — and it requires both accounting knowledge and structured thinking.",
  },
  {
    day: 25, week: 4,
    title: "Governance, Controls and AI Logs",
    category: "Controls & Ethics",
    summary: "Understand AI governance for finance: who approves use cases, how outputs are logged, how prompts are stored, and how changes are monitored. Build a simple governance framework for your team.",
    task: "Define 3 governance roles for AI use in your finance team: (1) Business Owner — accountable for the use case, (2) Tool Owner — responsible for configuration and access, (3) Reviewer — signs off on AI outputs before they enter the books. For each role, write 3 specific responsibilities they own.",
    tools: ["ChatGPT", "Claude", "Google Docs"],
    whyItMatters: "Regulators and auditors are increasingly asking 'who is responsible for this AI output?' A governance framework that answers that question — with names and sign-offs — is essential for any team using AI in a finance context.",
  },
  {
    day: 26, week: 4,
    title: "Evaluating AI Tools for Finance",
    category: "Controls & Ethics",
    summary: "Learn how to assess AI tools for finance use: security, data privacy, explainability, ERP integration, jurisdictional data rules, and vendor due diligence. Build a repeatable evaluation checklist.",
    task: "Build a 5-question vendor checklist for evaluating any new AI tool for finance use. Questions must cover: data storage and jurisdiction, audit log and export capability, explainability of outputs, data retention and deletion policy, and regulatory compliance certifications. For each question, note what a satisfactory answer looks like.",
    tools: ["ChatGPT", "Claude", "Perplexity AI"],
    whyItMatters: "Finance teams are being sold AI tools aggressively in 2026. Having a rigorous evaluation checklist protects your organisation and positions you as the trusted gatekeeper — not just an enthusiastic adopter.",
  },
  {
    day: 27, week: 4,
    title: "The AI-Augmented Finance Team — Roles and Careers",
    category: "Mixed",
    summary: "Understand how the finance team is evolving in 2026: AI-literate accountant, automation lead, data-savvy controller. Learn what upskilling looks like and how to position yourself for the roles that are emerging.",
    task: "Write a 'future CV bullet' — a single professional bullet point describing how you use AI in your daily accounting work. It should be specific, outcome-focused, and free of jargon. Then write a 3-sentence answer to the interview question: 'How do you ensure AI outputs in your finance function are reliable and auditable?'",
    tools: ["ChatGPT", "Claude", "Gemini"],
    whyItMatters: "The accountants who thrive in the next 5 years won't be the best at double-entry — they'll be the best at directing, reviewing, and governing AI. This task makes that narrative concrete and interview-ready.",
  },
  {
    day: 28, week: 4,
    title: "Week 4 Mini-Project — Your AI-Ready Accounting Blueprint",
    category: "Mixed",
    isMiniProject: true,
    summary: "Bring everything together into a personal blueprint: your tools, workflows, controls, governance approach, and 90-day development plan. This is your Level 1 capstone and your most valuable portfolio piece.",
    task: "Produce a one-page 'AI-Ready Accounting Blueprint' document. Include: (1) Top 3 processes you will AI-assist in the next 90 days, (2) Control points and review steps for each, (3) Tools you will trial or implement, (4) Governance roles in your team, (5) Skills you will build next. Share in the community with the hashtag #AIAccountingBlueprint for peer feedback. This is your capstone — congratulations on completing the 28-day challenge.",
    tools: ["ChatGPT", "Claude", "Google Docs", "Canva"],
    whyItMatters: "This blueprint is real, actionable, and shareable. It's evidence of 28 days of structured learning and a practical plan for your next 90. Whether you show it to a manager, a client, or use it privately — it marks you as someone who has thought seriously about AI in accounting.",
  },
];

// ─────────────────────────────────────────────
// WEEK OVERVIEWS
// ─────────────────────────────────────────────

export const weekOverviews: WeekOverview[] = [
  {
    week: 1,
    title: "AI Era, Foundations & Your Toolkit",
    color: "#0d7c8a",
    outcomes: [
      "Understand how AI is changing accounting in 2026",
      "Write effective accounting-specific prompts",
      "Identify the right AI tool for each accounting task",
      "Map your current tech stack and find AI opportunities",
      "Design your first AI-assisted bookkeeping review checklist",
    ],
  },
  {
    week: 2,
    title: "Core Accounting Workflows with AI",
    color: "#2f6fa8",
    outcomes: [
      "Understand how data quality drives AI output quality",
      "Use AI to accelerate bank reconciliation",
      "Extract key data from documents using AI + OCR",
      "Build an AI-assisted month-end close checklist",
      "Draft professional client communications with AI",
    ],
  },
  {
    week: 3,
    title: "Controls, Reporting & Advanced Workflows",
    color: "#7a5fc0",
    outcomes: [
      "Define the human-AI boundary in professional accounting",
      "Configure and interpret AI fraud detection triggers",
      "Use AI to draft financial disclosures and reporting",
      "Build audit-ready AI evidence logs",
      "Produce an AI Workflow Audit as a portfolio piece",
    ],
  },
  {
    week: 4,
    title: "Advisory, Governance & Capstone",
    color: "#2f8c5c",
    outcomes: [
      "Use AI for forecasting, scenario analysis, and profitability insights",
      "Translate accounting policy into AI-executable logic",
      "Build a governance and controls framework for AI in finance",
      "Evaluate AI tools using a professional vendor checklist",
      "Complete your AI-Ready Accounting Blueprint",
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
      "Role + Context + Task + Format + Constraints prompt framework",
      "AI tool selection by use case (general vs accounting-native)",
      "Tech stack mapping: where AI sits, where it should sit",
      "AI-assisted bookkeeping review checklist SOP",
      "Data quality assessment before AI deployment",
    ],
  },
  {
    week: 2,
    title: "Core Accounting Workflows",
    systems: [
      "Bank reconciliation rule-set and anomaly prompt library",
      "Invoice data extraction field checklist",
      "AI-assisted month-end close SOP (5-step)",
      "Variance commentary prompt specification framework",
      "Client communication drafting workflow (bullets → narrative)",
    ],
  },
  {
    week: 3,
    title: "Controls & Reporting",
    systems: [
      "Human-AI classification framework (automate / assist / human-only)",
      "Fraud detection trigger configuration checklist",
      "Disclosure note prompt template (policy + numbers + standard)",
      "AI evidence log for audit readiness",
      "AI Workflow Audit methodology (6-8 step process map)",
    ],
  },
  {
    week: 4,
    title: "Advisory & Governance",
    systems: [
      "Scenario analysis prompt structure (best / base / worst case)",
      "Policy-to-IF-THEN rules translation method",
      "AI governance roles and responsibilities framework",
      "Vendor evaluation checklist (5-question due diligence)",
      "AI-Ready Accounting Blueprint template",
    ],
  },
];

// ─────────────────────────────────────────────
// METRICS TO TRACK
// ─────────────────────────────────────────────

export const metricsToTrack = [
  {
    metric: "Prompt Quality",
    why: "Track how often your first AI prompt gives you usable output. Improving this ratio is the single fastest way to save time in an accounting workflow.",
  },
  {
    metric: "Review Time per Task",
    why: "Measure how long it takes to review AI-assisted outputs vs doing them manually. This is your productivity argument for adopting AI in your team.",
  },
  {
    metric: "Errors Caught in Review",
    why: "Track how many AI suggestions you correct or reject. A high correction rate means your prompts or data quality need work — a useful signal.",
  },
  {
    metric: "Portfolio Pieces Completed",
    why: "Count the SOPs, checklists, workflow maps, and templates you've built. Each one is a deployable artefact — not just a learning exercise.",
  },
];

// ─────────────────────────────────────────────
// STARTER TOOLKIT
// ─────────────────────────────────────────────

export const starterToolkit: ToolkitItem[] = [

  // ── AI Assistants ────────────────────────────────────────────────────────
  {
    name: "Claude",
    url: "https://claude.ai",
    category: "AI Assistant",
    desc: "Anthropic's AI assistant — strong at structured reasoning, long documents, and following complex instructions. Excellent for drafting disclosures, management commentary, and policy analysis.",
  },
  {
    name: "ChatGPT",
    url: "https://chat.openai.com",
    category: "AI Assistant",
    desc: "Primary AI assistant for global users. Strong at drafting, summarising, and explaining accounting concepts in plain English. Note: geo-blocked in HK — use Gemini or Claude instead.",
  },
  {
    name: "Gemini",
    url: "https://gemini.google.com",
    category: "AI Assistant",
    desc: "Google's AI assistant — primary recommendation for Hong Kong users. Built natively into Google Docs and Sheets, making it the most seamless option for spreadsheet-heavy accounting work.",
  },
  {
    name: "Perplexity AI",
    url: "https://perplexity.ai",
    category: "AI Assistant",
    desc: "AI-powered research tool that cites its sources. Best for tax research, standard lookups, and regulatory summaries — always check the underlying source before relying on output.",
  },

  // ── Accounting Platforms ─────────────────────────────────────────────────
  {
    name: "Xero",
    url: "https://xero.com",
    category: "Accounting Platform",
    desc: "Cloud accounting platform with built-in AI for transaction categorisation, bank reconciliation, and reporting. The most common platform in SME accounting in 2026.",
  },
  {
    name: "QuickBooks",
    url: "https://quickbooks.intuit.com",
    category: "Accounting Platform",
    desc: "AI-assisted bookkeeping, cash flow forecasting, and reporting. Strong in the US and increasingly used globally. QuickBooks Assistant handles natural language queries on your data.",
  },
  {
    name: "Dext",
    url: "https://dext.com",
    category: "Document AI",
    desc: "OCR and AI document extraction for invoices, receipts, and bank statements. Integrates directly with Xero and QuickBooks to eliminate manual data entry.",
  },
  {
    name: "Hubdoc",
    url: "https://hubdoc.com",
    category: "Document AI",
    desc: "Automated document collection and data extraction. Fetches bills and statements directly from supplier portals and extracts key fields for bookkeeping.",
  },

  // ── Productivity & Spreadsheets ───────────────────────────────────────────
  {
    name: "Microsoft Copilot",
    url: "https://copilot.microsoft.com",
    category: "Productivity",
    desc: "AI built into Excel, Word, and Outlook. Use in Excel for formula writing, data analysis, and chart generation. Use in Word for drafting management commentary and reports.",
  },
  {
    name: "Google Workspace",
    url: "https://workspace.google.com",
    category: "Productivity",
    desc: "Docs, Sheets, and Drive with Gemini built in. 'Help me write' in Docs and 'Ask Gemini' in Sheets cover most accounting drafting and analysis needs for free.",
  },
  {
    name: "Notion",
    url: "https://notion.so",
    category: "Productivity",
    desc: "Build your prompt library, store SOPs, and organise your portfolio pieces. A shared Notion page is a fast way to make your AI governance documentation accessible to your team.",
  },
];

// ─────────────────────────────────────────────
// PORTFOLIO TARGETS
// ─────────────────────────────────────────────

export const portfolioTargets: PortfolioTarget[] = [
  {
    title: "AI Readiness Snapshot",
    week: 1,
    desc: "One-page summary: 3 automation opportunities, tech stack diagram, top 3 AI tools, and a best prompt example — your baseline for the full 28 days.",
  },
  {
    title: "Bookkeeping Review Checklist",
    week: 1,
    desc: "A structured review checklist for AI-suggested transaction categories, including thresholds, vendor rules, and escalation criteria.",
  },
  {
    title: "Month-End Close SOP",
    week: 2,
    desc: "A 5-step AI-assisted close checklist specifying what AI does, what the human reviews, and the sign-off requirement for each step.",
  },
  {
    title: "Reconciliation Rule-Set",
    week: 2,
    desc: "A numbered library of AI prompts and rules for surfacing bank reconciliation mismatches — deployable in Xero, QuickBooks, or as manual prompts.",
  },
  {
    title: "AI Workflow Audit",
    week: 3,
    desc: "A one-page structured assessment of an end-to-end accounting process: current workflow, AI opportunities, control points, and risks — formatted as a consulting deliverable.",
  },
  {
    title: "Disclosure Note Prompt Template",
    week: 3,
    desc: "A reusable prompt template for AI to draft a financial disclosure note, taking accounting policy, numbers, and standard reference as inputs.",
  },
  {
    title: "AI Governance Framework",
    week: 4,
    desc: "A defined set of governance roles (Business Owner, Tool Owner, Reviewer) with responsibilities — a one-page document your team can actually use.",
  },
  {
    title: "Vendor Evaluation Checklist",
    week: 4,
    desc: "A 5-question due diligence checklist for evaluating any new AI tool in a finance context, covering data, security, explainability, and compliance.",
  },
  {
    title: "AI-Ready Accounting Blueprint",
    week: 4,
    desc: "Your capstone: top 3 processes to AI-assist, control points, tools to trial, governance roles, and a 90-day skills plan — one page, shareable, and genuinely useful.",
  },
];
