// =============================================================================
// AI Sprint — Accounting Level 1 (Basic) Curriculum
// Mastering Accounting in 28 Days — Basic Track
// Audience: Beginners, junior accountants, bookkeepers, non-finance founders
// Outcome: Build accounting confidence and learn how AI supports daily finance
//          work in 15 minutes a day.
// Updated: April 2026
// =============================================================================

export type Category =
  | "Foundations"
  | "Bookkeeping"
  | "Reporting"
  | "Tax & Compliance"
  | "Controls & Ethics"
  | "Mixed";

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
// CURRICULUM — 28 Days Basic Track
// ─────────────────────────────────────────────

export const curriculum: DayLesson[] = [

  // ── WEEK 1: Accounting Meets AI — Foundations ────────────────────────────
  {
    day: 1, week: 1,
    title: "What Accounting Looks Like in the AI Era",
    category: "Foundations",
    summary: "Get a clear picture of how accounting is changing in 2026. AI is not replacing accountants — it is taking over the repetitive, low-judgement work so accountants can focus on analysis, advisory, and decisions. Understand the shift from backward-looking bookkeeping to real-time, AI-assisted finance.",
    task: "Write down 3 accounting tasks you do (or imagine doing) that feel repetitive and rule-based. For each one, write a single sentence on what it would look like if AI handled the first draft and you just reviewed it. This is your starting point — you will revisit it on Day 28.",
    tools: ["ChatGPT", "Claude", "Gemini"],
    whyItMatters: "Understanding the AI shift in accounting is not optional in 2026. Every employer, client, and colleague will expect you to have a view on this. Starting with the big picture means every lesson from here has context.",
  },
  {
    day: 2, week: 1,
    title: "The Accounting Equation and Double-Entry Basics",
    category: "Foundations",
    summary: "Every financial transaction follows one rule: Assets = Liabilities + Equity. This is the foundation everything else is built on. Learn double-entry bookkeeping — every transaction has two sides — and why this matters even when AI is doing the coding.",
    task: "Write out 5 simple transactions (e.g. paid rent, received payment from customer, bought office supplies). For each one, identify which accounts are debited and credited. Then ask your AI tool to check your answers and explain any you got wrong in plain English.",
    tools: ["ChatGPT", "Claude", "Gemini"],
    whyItMatters: "AI tools categorise transactions automatically — but if you do not understand debits and credits, you cannot spot when AI makes a mistake. This is the foundation that makes you the expert, not just the approver.",
  },
  {
    day: 3, week: 1,
    title: "Journals, Ledgers, and Trial Balance",
    category: "Foundations",
    summary: "Learn how transactions flow from journal entries into ledger accounts, and how the trial balance checks that everything balances. Understand how modern cloud accounting systems handle this flow automatically — and where AI sits in that process.",
    task: "Ask your AI tool to walk you through the flow of one transaction — from journal entry to ledger to trial balance — using a simple example like a £500 sale on credit. Then in your own words, write a 3-sentence explanation of the flow as if explaining to a non-accountant colleague.",
    tools: ["ChatGPT", "Claude", "Gemini", "Xero", "QuickBooks"],
    whyItMatters: "The journal-to-trial-balance flow is the backbone of every accounting system. Cloud tools automate it, but auditors, managers, and clients will ask you to explain it. Being able to do that clearly is a career skill.",
  },
  {
    day: 4, week: 1,
    title: "Income Statement, Balance Sheet, and Cash Flow in Plain English",
    category: "Foundations",
    summary: "The three main financial statements tell three different stories: profitability, financial position, and cash movement. Learn what each statement shows, how they connect, and how to read them quickly — a skill AI can help you practice.",
    task: "Find or create a simple set of fictional financials (or ask your AI tool to generate one for a small fictional business). Ask AI to explain what the income statement, balance sheet, and cash flow statement each tell you about that business. Write a 5-sentence summary in your own words.",
    tools: ["ChatGPT", "Claude", "Gemini"],
    whyItMatters: "Being able to read and explain financial statements is the single most valuable skill in accounting. Every stakeholder — from a bank manager to a startup founder — needs someone who can translate numbers into plain English.",
  },
  {
    day: 5, week: 1,
    title: "Cloud Accounting Tools, ERPs, and the Modern Finance Stack",
    category: "Foundations",
    summary: "Understand the tools that power modern accounting: cloud platforms like Xero and QuickBooks, ERPs for larger businesses, bank feeds, OCR invoice capture, and expense tools. Learn how AI layers on top of these systems to automate data entry, categorisation, and reporting.",
    task: "Draw or describe your current finance tool stack (or a typical small business stack if you are new to accounting). Mark each tool with: (G) if it has AI features already, (C) if AI could be added, or (M) if it is still mostly manual. This becomes your personal tech map.",
    tools: ["Xero", "QuickBooks", "Dext", "Hubdoc", "Microsoft Copilot"],
    whyItMatters: "You cannot improve a system you cannot see. Mapping the finance stack is the first step to knowing where AI saves the most time — and where you still need human judgement.",
  },
  {
    day: 6, week: 1,
    title: "Where AI Helps Accountants Today",
    category: "Mixed",
    summary: "Get a concrete picture of where AI is genuinely useful in accounting right now: transaction coding, drafting emails and commentary, bank reconciliation matching, summarising documents, and generating first drafts of reports. Separate hype from reality.",
    task: "Pick one accounting task from this list: (1) writing a client email about an overdue invoice, (2) summarising a month's expenses in plain English, (3) explaining a VAT rule simply. Use your AI tool to produce a first draft. Edit it so it sounds like you. Compare the time taken versus doing it from scratch.",
    tools: ["ChatGPT", "Claude", "Gemini", "Google Docs"],
    whyItMatters: "The fastest way to build confidence with AI is to use it on a real task and see the output. This exercise gives you direct experience of where AI saves time — and what editing it still needs.",
  },
  {
    day: 7, week: 1,
    title: "Week 1 Mini-Project — Build Your AI Review Checklist",
    category: "Mixed",
    isMiniProject: true,
    summary: "Before going further, establish one of the most important principles in accounting AI: what must never be auto-trusted. AI makes mistakes, hallucinates figures, and misses context. This mini-project builds your critical review instinct from week one.",
    task: "Ask your AI tool to produce: (1) a journal entry for a lease payment, (2) a short explanation of the difference between capital and revenue expenditure, (3) a draft email chasing a late payment. For each output, identify at least one thing you would change or verify before using it. Write your personal 'AI Review Checklist' — 5 rules you will always apply to AI accounting output. Save it as portfolio piece #1.",
    tools: ["ChatGPT", "Claude", "Gemini"],
    whyItMatters: "Your AI review checklist is a real professional tool. It protects you from errors, demonstrates judgement to employers and clients, and forms the foundation of every AI-assisted workflow you build from here.",
  },

  // ── WEEK 2: Bookkeeping Workflows with AI ────────────────────────────────
  {
    day: 8, week: 2,
    title: "AI-Assisted Transaction Categorisation and GL Coding",
    category: "Bookkeeping",
    summary: "Learn how AI reads transaction descriptions and suggests general ledger codes based on patterns and rules. Understand how cloud systems learn from corrections, and how to design a review workflow that catches errors before they reach the trial balance.",
    task: "Design a review checklist for AI-suggested transaction categories. Include at least 5 rules covering: amount thresholds for manual review, new vendor names, balance sheet vs P&L coding, round-number transactions, and anything posted to a miscellaneous or suspense account.",
    tools: ["Xero", "QuickBooks", "ChatGPT", "Claude"],
    whyItMatters: "AI categorisation is only as reliable as the review process behind it. Your checklist is an SOP that turns AI from a risk into a genuine time-saver.",
  },
  {
    day: 9, week: 2,
    title: "Invoice Capture, OCR, Receipts, and Document Extraction",
    category: "Bookkeeping",
    summary: "Learn how AI uses OCR to read invoices, receipts, and contracts, extract key data fields, and push them into your accounting system. Understand the limits — blurry scans, unusual formats, and missing fields all need human attention.",
    task: "Define the minimum data fields an AI should extract from an invoice to make it bookkeeping-ready: date, vendor name, vendor tax ID, line items, amounts, tax, PO reference, payment terms, and currency. Write a prompt instructing AI to extract these fields from a described invoice and flag anything missing or unclear.",
    tools: ["Dext", "Hubdoc", "ChatGPT", "Claude"],
    whyItMatters: "Document AI eliminates manual data entry — one of the most time-consuming tasks in bookkeeping. Knowing exactly what to extract means you can configure and audit the tool, not just switch it on.",
  },
  {
    day: 10, week: 2,
    title: "Bank Feeds and Basic Reconciliation Logic",
    category: "Bookkeeping",
    summary: "Understand how bank feeds work in cloud accounting systems, and how AI matches bank transactions to invoices and payments. Learn the basic rules of reconciliation — matching, timing differences, missing items — and how to write prompts that surface exceptions.",
    task: "Write 3 reconciliation rules as AI prompts. Examples: 'Flag any bank transaction with no matching invoice within 5 days', 'Highlight all payments to the same vendor twice in one week', 'List all unmatched transactions over £200 at month end'. Format them as a numbered prompt library you can reuse.",
    tools: ["Xero", "QuickBooks", "ChatGPT", "Claude"],
    whyItMatters: "Bank reconciliation is one of the first accounting tasks AI genuinely accelerates. Writing your own rules means you control what gets flagged — and you understand the logic, not just the output.",
  },
  {
    day: 11, week: 2,
    title: "Common Bookkeeping Errors and How AI Can Flag Them",
    category: "Bookkeeping",
    summary: "Learn the most common bookkeeping errors: wrong account, wrong period, duplicates, missing entries, tax miscoding, and transposition errors. Understand how AI can be prompted to screen for these — and which ones still require human investigation.",
    task: "Create a 'Bookkeeping Error Spotter' prompt list — 5 prompts you could run on a set of transactions to catch common errors. For each prompt, note: what error it catches, why it matters, and what you would do if it fires. This is a reusable quality control tool.",
    tools: ["ChatGPT", "Claude", "Excel / Google Sheets"],
    whyItMatters: "Errors in the books compound over time. Catching them early with AI-assisted screening saves hours of correction at month end and protects the integrity of your financial statements.",
  },
  {
    day: 12, week: 2,
    title: "Basic Prompting for Accountants — Summaries, Emails, and Explanations",
    category: "Mixed",
    summary: "Learn the anatomy of an effective accounting prompt: role, context, task, format, and constraints. See why vague prompts produce vague output — and how adding context transforms results.",
    task: "Write 5 prompts for 5 different accounting communication tasks: (1) summarise a month's P&L for a non-finance director, (2) draft a chaser for a 30-day overdue invoice, (3) explain accruals to a new team member, (4) summarise VAT registration rules, (5) turn 3 variance bullet points into a board-ready paragraph. Compare quality with and without context.",
    tools: ["ChatGPT", "Claude", "Gemini"],
    whyItMatters: "Prompting is the most transferable skill in this course. The difference between a prompt that saves 20 minutes and one that wastes 10 is usually just specificity and context.",
  },
  {
    day: 13, week: 2,
    title: "Excel and AI for Cleaning and Organising Finance Data",
    category: "Bookkeeping",
    summary: "Learn how to use AI inside and alongside Excel and Google Sheets to clean messy finance data: removing duplicates, standardising vendor names, filling gaps, fixing date formats, and structuring exports for accounting systems.",
    task: "Ask AI to generate a messy fictional dataset — 20 rows of transaction data with inconsistent vendor names, mixed date formats, and some blank fields. Use AI to write the Excel formulas or steps to clean it. Document your process as a reusable 5-step 'Data Cleaning SOP' in plain English.",
    tools: ["Microsoft Copilot", "ChatGPT", "Claude", "Excel / Google Sheets"],
    whyItMatters: "Dirty data is the biggest hidden cost in accounting AI. Tools produce bad output from bad input. Being able to clean data quickly — and document how — saves teams hours every month.",
  },
  {
    day: 14, week: 2,
    title: "Week 2 Applied Lab — Categorise, Reconcile, and Explain a Mini Dataset",
    category: "Bookkeeping",
    isMiniProject: true,
    summary: "Put weeks 1 and 2 together in one practical exercise. Work through a small fictional dataset end to end: categorise transactions, reconcile to a bank statement, flag errors, and write a plain-English summary for the business owner.",
    task: "Ask AI to generate a fictional mini dataset: 15 transactions for a small business for one month, plus a bank statement with 2 discrepancies. Then: (1) categorise each transaction to a GL code, (2) reconcile to the bank statement and identify the 2 differences, (3) write a 5-sentence plain-English summary for the business owner. Save your output — this is portfolio piece #2.",
    tools: ["ChatGPT", "Claude", "Excel / Google Sheets", "Xero"],
    whyItMatters: "This is real accounting work compressed into 15 minutes. Completing it proves you can handle the end-to-end bookkeeping workflow with AI assistance — a genuine portfolio piece.",
  },

  // ── WEEK 3: Month-End, Controls, and Ethics ──────────────────────────────
  {
    day: 15, week: 3,
    title: "Accruals, Prepayments, and Adjusting Entries in AI-Assisted Workflows",
    category: "Foundations",
    summary: "Learn what accruals and prepayments are, why they matter for accurate financial statements, and how AI can help identify missing accruals and draft adjusting journal entries — while the accountant retains the final judgement call.",
    task: "Ask AI to explain the difference between an accrual and a prepayment using two concrete small business examples. Then write a prompt that reviews a list of expenses and flags any likely to need an accrual at month end. Test it with 5 made-up expenses.",
    tools: ["ChatGPT", "Claude", "Gemini"],
    whyItMatters: "Accruals are where accounting accuracy lives. AI can speed up identification — but the judgement on whether to accrue always stays with you.",
  },
  {
    day: 16, week: 3,
    title: "Accounts Payable Basics in an Automated Workflow",
    category: "Bookkeeping",
    summary: "Learn the accounts payable cycle: invoice receipt, coding, approval, payment, and reconciliation. Understand how AI and automation handle each step — and where human approval gates are non-negotiable.",
    task: "Map the AP process in 6 steps from invoice received to payment made. For each step, classify as: (A) fully automatable, (B) AI-assisted with human review, or (C) human only. Write a control rule for each step marked (B) — what must the human check before approving?",
    tools: ["Dext", "Hubdoc", "Xero", "QuickBooks", "ChatGPT"],
    whyItMatters: "AP is one of the highest-fraud-risk areas in accounting. Knowing exactly where human approval must sit — even in a heavily automated workflow — keeps controls intact and auditors satisfied.",
  },
  {
    day: 17, week: 3,
    title: "Accounts Receivable Basics and Cash Collection Insights",
    category: "Bookkeeping",
    summary: "Learn the accounts receivable cycle: raising invoices, tracking payments, chasing overdue accounts, and reconciling debtor balances. See how AI helps draft chasers, predict late payers, and summarise aging reports.",
    task: "Use AI to draft 3 payment chaser emails: one for 7-day overdue (gentle reminder), one for 30-day overdue (firmer tone), one for 60-day overdue (formal notice). Edit each to match a professional but human tone. Save them as your AR email template library — portfolio piece #3.",
    tools: ["ChatGPT", "Claude", "Gemini", "Xero", "QuickBooks"],
    whyItMatters: "Cash collection is directly linked to business survival. AI-drafted chasers save time and maintain consistency — but the tone and timing decisions are always yours.",
  },
  {
    day: 18, week: 3,
    title: "Expense Management and Reimbursement Checks with AI",
    category: "Bookkeeping",
    summary: "Learn how expense management works: submission, receipt matching, policy compliance, coding, and approval. Understand how AI flags policy breaches, duplicate claims, and missing receipts.",
    task: "Write a 5-rule expense policy for a fictional small business (e.g. meals capped at £30, all receipts required over £10, no personal items, travel pre-approved over £200). Then write an AI prompt that checks a list of expense claims against these rules and flags breaches. Test with 5 fictional claims.",
    tools: ["ChatGPT", "Claude", "Excel / Google Sheets"],
    whyItMatters: "Expense fraud is one of the most common forms of financial misconduct in small businesses. A simple AI-assisted review catches the majority of issues before they become problems.",
  },
  {
    day: 19, week: 3,
    title: "Month-End Close Basics and AI-Generated Variance Summaries",
    category: "Reporting",
    summary: "Learn the month-end close process: completing postings, reconciling key accounts, reviewing the trial balance, and producing management accounts. See how AI generates variance summaries from raw numbers.",
    task: "Draft a 5-step AI-assisted month-end close checklist. Each step should specify: what AI does, what the human reviews, and the sign-off requirement. Then write an AI prompt that turns a list of budget vs actual variance bullets into a plain-English management commentary (150 words, non-finance audience).",
    tools: ["ChatGPT", "Claude", "Gemini", "Excel / Google Sheets", "Xero"],
    whyItMatters: "AI-assisted variance summaries compress a 2-hour writing task into 10 minutes of editing — but only if you know what good looks like.",
  },
  {
    day: 20, week: 3,
    title: "Internal Controls Basics — Approvals, Audit Trail, and Segregation of Duties",
    category: "Controls & Ethics",
    summary: "Learn the three pillars of internal controls: segregation of duties, approval gates, and audit trail. Understand how AI fits within — not around — these controls.",
    task: "Map a simple purchase-to-pay process (raise PO → receive invoice → approve → pay → reconcile). Assign a role and control to each step. Identify where AI is used and confirm no AI step bypasses a required human approval. Write a one-paragraph control summary.",
    tools: ["ChatGPT", "Claude"],
    whyItMatters: "AI that bypasses controls is not an efficiency gain — it is a liability. Understanding this distinction is foundational to working responsibly in finance.",
  },
  {
    day: 21, week: 3,
    title: "Ethics, Privacy, and Confidentiality in Finance AI Usage",
    category: "Controls & Ethics",
    summary: "Understand the ethical obligations of using AI in finance: data privacy, financial confidentiality, the risk of AI hallucinations in numerical outputs, and the professional standards that govern what accountants can and cannot delegate to AI.",
    task: "Write your personal 'AI Usage Policy' — 5 rules covering: what data you will never paste into a public AI tool, what outputs you will always verify, what decisions AI must never make for you, how you will disclose AI use to clients or employers, and one rule unique to your own context. Save it as portfolio piece #4.",
    tools: ["ChatGPT", "Claude"],
    whyItMatters: "Your professional reputation is built on trust. Having a personal AI usage policy is not overcaution — it is the professional standard for 2026.",
  },

  // ── WEEK 4: Reporting, Communication, and Capstone ───────────────────────
  {
    day: 22, week: 4,
    title: "Tax and Compliance Support — Where AI Can Help and Where It Cannot Decide",
    category: "Tax & Compliance",
    summary: "Learn how to use AI for tax research and compliance preparation — and where the hard limits are. AI can summarise rules, surface guidance, and draft checklists. It cannot give tax advice, interpret ambiguous situations, or sign off on a return.",
    task: "Draft a prompt that asks AI to summarise the key steps in one tax process relevant to your work (e.g. VAT filing, payroll tax, year-end corporation tax). Instruct AI to: (1) summarise the process, (2) list key deadlines, (3) identify official sources to verify against, (4) flag areas where professional advice is recommended. Note any gaps in the output.",
    tools: ["ChatGPT", "Claude", "Perplexity AI"],
    whyItMatters: "Tax is the highest-risk area for AI errors. Using it as a research accelerator — not an advisor — keeps you on the right side of professional standards while still saving time.",
  },
  {
    day: 23, week: 4,
    title: "Reporting Basics — Turning Numbers into Management Commentary",
    category: "Reporting",
    summary: "Learn how to take financial numbers and turn them into clear, useful management commentary. Understand what a non-finance reader needs: context, comparison, explanation, and implication.",
    task: "Use these fictional variance bullets: Revenue up 15% vs budget (new client in March), Wages up 9% (two new hires), Travel down 60% (no client visits), Software up 22% (new CRM). Write a prompt specification and use AI to turn them into a 150-word board report commentary. Edit the output and note what you changed.",
    tools: ["ChatGPT", "Claude", "Gemini", "Google Docs"],
    whyItMatters: "Translating numbers into narrative is one of the highest-value skills in accounting. AI gets you to a strong first draft in minutes — your editing makes it accurate, credible, and yours.",
  },
  {
    day: 24, week: 4,
    title: "AI for Client Communication and Finance Storytelling",
    category: "Reporting",
    summary: "Learn how to use AI to draft professional client communications: financial update emails, meeting summaries, plain-English explanations of complex topics, and narrative that connects numbers to business decisions.",
    task: "Draft 3 client communications using AI: (1) a monthly financial update email for a small business owner summarising their P&L (fictional numbers), (2) a plain-English explanation of why their cash balance dropped despite showing a profit, (3) a short paragraph summarising action items from a fictional finance review meeting. Edit each for tone and accuracy.",
    tools: ["ChatGPT", "Claude", "Gemini", "Google Docs"],
    whyItMatters: "Clients do not pay for numbers — they pay for clarity. Accountants who communicate financial stories clearly are valued far above those who only produce accurate reports.",
  },
  {
    day: 25, week: 4,
    title: "Data Quality — Chart of Accounts, Naming Conventions, and Source Integrity",
    category: "Foundations",
    summary: "Understand why clean, well-structured data is the foundation of reliable AI output in accounting. Learn what a good chart of accounts looks like, why naming conventions matter, and how source data integrity affects every downstream report.",
    task: "Identify 5 common data quality problems in accounting systems (e.g. multiple names for the same vendor, free-text memo fields, missing cost centre codes). For each: write what good data looks like, how bad data affects AI output, and one step to fix or prevent it. Format as a 5-row reference table.",
    tools: ["ChatGPT", "Claude", "Excel / Google Sheets"],
    whyItMatters: "Garbage in, garbage out. No AI tool produces reliable accounting output from messy data. Being the person who understands and fixes data quality issues makes you indispensable.",
  },
  {
    day: 26, week: 4,
    title: "Basic KPI Tracking for Small Business Finance",
    category: "Reporting",
    summary: "Learn the 5–8 key performance indicators every small business should track: gross margin, net margin, cash runway, debtor days, creditor days, revenue growth, and burn rate. See how AI calculates, visualises, and narrates these KPIs.",
    task: "Choose 5 KPIs. For each: write the formula, explain what it tells you about the business, and write an AI prompt that calculates and interprets it from a given set of fictional financials. Test one prompt with made-up numbers and evaluate the output.",
    tools: ["ChatGPT", "Claude", "Excel / Google Sheets", "Google Docs"],
    whyItMatters: "KPIs turn financial statements into decision tools. Being able to calculate, explain, and narrate KPIs with AI support is a core advisory skill that business owners genuinely value.",
  },
  {
    day: 27, week: 4,
    title: "Build Your Personal Accountant Prompt Library",
    category: "Mixed",
    summary: "Consolidate 28 days of prompting into a reusable personal library. A prompt library is one of the highest-value tools an AI-literate accountant can build — it makes every recurring task faster and more consistent.",
    task: "Build a prompt library document with at least 10 prompts across 6 categories: (1) bookkeeping and categorisation, (2) reconciliation and error checking, (3) month-end close and variance commentary, (4) client communication, (5) tax research, (6) data cleaning. For each prompt include: the prompt text, when to use it, and one example output. Save in Google Docs or Notion — portfolio piece #5.",
    tools: ["ChatGPT", "Claude", "Gemini", "Google Docs", "Notion"],
    whyItMatters: "A prompt library is a productivity multiplier. It means you never start from scratch on a recurring task — and showing one to an employer or client demonstrates genuine, practical AI literacy.",
  },
  {
    day: 28, week: 4,
    title: "Final Challenge — Design Your AI-Assisted Monthly Accounting Workflow",
    category: "Mixed",
    isMiniProject: true,
    summary: "Bring together everything from 28 days into one practical, personal output: your AI-assisted monthly accounting workflow. This is your Basic Level capstone — a real, deployable document that shows what you have built over four weeks.",
    task: "Produce a one-page 'AI-Assisted Monthly Accounting Workflow'. Include: (1) a 6-step workflow from transaction capture to reporting, (2) the AI tool at each step, (3) the human review point at each step, (4) your top 3 prompts from Day 27, (5) your personal AI usage rules from Day 21, (6) a one-paragraph reflection: what surprised you, what you will use immediately, and what you want to learn next. Share in the community with #AccountingAIBasic. Congratulations on completing the 28-day challenge!",
    tools: ["ChatGPT", "Claude", "Google Docs", "Notion", "Canva"],
    whyItMatters: "This document is real, deployable, and shareable. It is evidence of 28 days of structured learning — and a genuine foundation for the Advanced track.",
  },
];

// ─────────────────────────────────────────────
// WEEK OVERVIEWS
// ─────────────────────────────────────────────

export const weekOverviews: WeekOverview[] = [
  {
    week: 1,
    title: "Accounting Meets AI — Foundations",
    color: "#0d7c8a",
    outcomes: [
      "Understand how AI is changing accounting in 2026",
      "Master the accounting equation and double-entry basics",
      "Read and explain the three main financial statements",
      "Map the modern finance tech stack",
      "Build your first AI review checklist",
    ],
  },
  {
    week: 2,
    title: "Bookkeeping Workflows with AI",
    color: "#2f6fa8",
    outcomes: [
      "Design AI-assisted transaction categorisation reviews",
      "Use OCR and document AI for invoice capture",
      "Write reconciliation rules as AI prompts",
      "Clean messy finance data with AI and Excel",
      "Complete an end-to-end bookkeeping mini-project",
    ],
  },
  {
    week: 3,
    title: "Month-End, Controls, and Ethics",
    color: "#7a5fc0",
    outcomes: [
      "Handle accruals, prepayments, and adjusting entries with AI",
      "Map AP and AR workflows with human approval gates",
      "Build a month-end close checklist and variance prompt",
      "Understand internal controls and segregation of duties",
      "Write your personal AI ethics and usage policy",
    ],
  },
  {
    week: 4,
    title: "Reporting, Communication, and Capstone",
    color: "#2f8c5c",
    outcomes: [
      "Use AI safely for tax research and compliance support",
      "Turn numbers into management commentary with AI",
      "Draft client communications and finance narratives",
      "Build a personal accountant prompt library",
      "Complete your AI-Assisted Monthly Accounting Workflow capstone",
    ],
  },
];

// ─────────────────────────────────────────────
// SYSTEMS SUMMARY
// ─────────────────────────────────────────────

export const systemsSummary = [
  {
    week: 1,
    title: "Foundations & AI Context",
    systems: [
      "AI review checklist — 5 rules for evaluating AI accounting output",
      "Finance tech stack map — tools, AI features, and manual gaps",
      "Financial statements plain-English summary framework",
      "Double-entry verification habit with AI as practice partner",
      "First prompt: AI as accounting explainer and tutor",
    ],
  },
  {
    week: 2,
    title: "Bookkeeping Workflow SOPs",
    systems: [
      "Transaction categorisation review checklist (5 rules)",
      "Invoice data extraction field checklist",
      "Reconciliation prompt library (3 core rules)",
      "Bookkeeping error spotter prompt list (5 prompts)",
      "Data cleaning SOP (5-step, plain English)",
    ],
  },
  {
    week: 3,
    title: "Month-End & Controls",
    systems: [
      "Month-end close checklist with AI and human review steps",
      "AP process map with control classifications (A/B/C)",
      "AR email template library (3 chaser tones)",
      "Expense policy + AI compliance check prompt",
      "Personal AI ethics and usage policy (5 rules)",
    ],
  },
  {
    week: 4,
    title: "Reporting & Communication",
    systems: [
      "Tax research prompt framework (process + sources + flags)",
      "Variance commentary prompt specification",
      "Client communication template set (update, explanation, summary)",
      "KPI calculation and narrative prompt set (5 KPIs)",
      "Personal accountant prompt library (10+ prompts, 6 categories)",
    ],
  },
];

// ─────────────────────────────────────────────
// METRICS TO TRACK
// ─────────────────────────────────────────────

export const metricsToTrack = [
  {
    metric: "Prompt Quality",
    why: "Track how often your first AI prompt gives usable output without heavy editing. Improving this is the fastest way to save time on recurring accounting tasks.",
  },
  {
    metric: "Review Time per Task",
    why: "Measure how long it takes to review and correct AI output vs doing it manually. This is your personal productivity case for AI adoption.",
  },
  {
    metric: "Errors Caught",
    why: "Track how many AI suggestions you correct or reject per session. A high rate signals your prompts or data need work.",
  },
  {
    metric: "Prompt Library Size",
    why: "Count the reusable prompts you have built. Each one represents a recurring task you have systematised. Aim for 10 by Day 28.",
  },
];

// ─────────────────────────────────────────────
// STARTER TOOLKIT
// ─────────────────────────────────────────────

export const starterToolkit: ToolkitItem[] = [

  // ── AI Assistants ─────────────────────────────────────────────────────────
  {
    name: "Claude",
    url: "https://claude.ai",
    category: "AI Assistant",
    desc: "Anthropic's AI — excellent for structured reasoning, long documents, and following complex accounting instructions. Best for drafting disclosures, management commentary, and policy analysis.",
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
    desc: "Google's AI — recommended for Hong Kong users. Built into Google Docs and Sheets. Use 'Help me write' in Docs and 'Ask Gemini' in Sheets for seamless accounting workflows.",
  },
  {
    name: "Perplexity AI",
    url: "https://perplexity.ai",
    category: "AI Assistant",
    desc: "AI research tool that cites sources. Best for tax rule lookups, standard references, and regulatory summaries. Always verify the underlying source before relying on output.",
  },

  // ── Accounting Platforms ──────────────────────────────────────────────────
  {
    name: "Xero",
    url: "https://xero.com",
    category: "Accounting Platform",
    desc: "Cloud accounting with AI transaction categorisation, bank reconciliation, and reporting. The most widely used SME platform in 2026. Free trial available.",
  },
  {
    name: "QuickBooks",
    url: "https://quickbooks.intuit.com",
    category: "Accounting Platform",
    desc: "AI-assisted bookkeeping, cash flow forecasting, and expense management. Strong in the US and widely used globally. QuickBooks Assistant handles natural language queries on your data.",
  },
  {
    name: "Dext",
    url: "https://dext.com",
    category: "Document AI",
    desc: "OCR and AI document extraction for invoices, receipts, and bank statements. Integrates with Xero and QuickBooks to eliminate manual data entry.",
  },
  {
    name: "Hubdoc",
    url: "https://hubdoc.com",
    category: "Document AI",
    desc: "Automated document collection and data extraction. Fetches bills and statements from supplier portals and extracts key fields for bookkeeping.",
  },

  // ── Productivity ──────────────────────────────────────────────────────────
  {
    name: "Microsoft Copilot",
    url: "https://copilot.microsoft.com",
    category: "Productivity",
    desc: "AI built into Excel, Word, and Outlook. Use in Excel for formula writing and data cleaning. Use in Word for drafting management commentary and client reports.",
  },
  {
    name: "Google Workspace",
    url: "https://workspace.google.com",
    category: "Productivity",
    desc: "Docs, Sheets, and Drive with Gemini built in. Free for personal use. 'Ask Gemini' in Sheets handles most accounting analysis and drafting needs without leaving your spreadsheet.",
  },
  {
    name: "Notion",
    url: "https://notion.so",
    category: "Productivity",
    desc: "Build your prompt library, store SOPs, and organise your portfolio pieces. A shared Notion page is the fastest way to make your AI governance documents accessible to a team.",
  },
];

// ─────────────────────────────────────────────
// PORTFOLIO TARGETS
// ─────────────────────────────────────────────

export const portfolioTargets: PortfolioTarget[] = [
  {
    title: "AI Review Checklist",
    week: 1,
    desc: "5 personal rules for evaluating AI accounting output before using it — your first professional AI governance document.",
  },
  {
    title: "Finance Tech Stack Map",
    week: 1,
    desc: "A visual map of your accounting tool stack with AI features marked — shows strategic awareness of the modern finance environment.",
  },
  {
    title: "Bookkeeping Error Spotter Prompts",
    week: 2,
    desc: "5 reusable AI prompts for catching common bookkeeping errors — a quality control tool you can deploy immediately.",
  },
  {
    title: "Mini Dataset Lab",
    week: 2,
    desc: "End-to-end worked example: 15 transactions categorised, reconciled to bank statement, and summarised in plain English.",
  },
  {
    title: "Month-End Close Checklist",
    week: 3,
    desc: "A 5-step AI-assisted close checklist with AI actions, human review points, and sign-off requirements — a deployable SOP.",
  },
  {
    title: "AR Email Template Library",
    week: 3,
    desc: "3 professionally drafted payment chaser emails at different overdue stages — a practical tool for any AR workflow.",
  },
  {
    title: "Personal AI Ethics Policy",
    week: 3,
    desc: "5 personal rules governing AI use in your finance work — demonstrates professional responsibility and confidentiality awareness.",
  },
  {
    title: "Accountant Prompt Library",
    week: 4,
    desc: "10+ reusable prompts across 6 accounting categories — the most practical and immediately deployable portfolio piece in the course.",
  },
  {
    title: "AI-Assisted Monthly Accounting Workflow",
    week: 4,
    desc: "Your 28-day capstone: a one-page workflow covering transaction capture to reporting, with AI tools, human review points, and personal usage rules.",
  },
];
