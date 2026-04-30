// =============================================================================
// AI Sprint — Accounting Course Curriculum
// Mastering Accounting with AI Integrations — Basic & Advanced
// Updated: April 2026
// =============================================================================

// ── Level 1 categories
export type CategoryL1 =
  | "Foundations"
  | "Bookkeeping"
  | "Reporting"
  | "Tax & Compliance"
  | "Controls & Ethics"
  | "Mixed";

// ── Level 2 categories
export type CategoryL2 =
  | "Strategy"
  | "Workflows"
  | "Reporting"
  | "Controls & Governance"
  | "Advisory"
  | "Mixed";

export type Category = CategoryL1 | CategoryL2;

export interface DayLesson {
  day: number;
  week: number;
  level: 1 | 2;
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
  level: 1 | 2;
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
  level: 1 | 2;
  desc: string;
}

// ─────────────────────────────────────────────
// WEEK OVERVIEWS — LEVEL 1
// ─────────────────────────────────────────────

export const weekOverviewsL1: WeekOverview[] = [
  {
    week: 1, level: 1,
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
    week: 2, level: 1,
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
    week: 3, level: 1,
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
    week: 4, level: 1,
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
// WEEK OVERVIEWS — LEVEL 2
// ─────────────────────────────────────────────

export const weekOverviewsL2: WeekOverview[] = [
  {
    week: 1, level: 2,
    title: "AI Close Design & Advanced Workflows",
    color: "#e8820c",
    outcomes: [
      "Assess your finance function's AI readiness and priority use cases",
      "Design an AI-assisted month-end close process",
      "Build advanced accounting prompts with full structure",
      "Create reusable workflows combining AI, spreadsheets, and rules",
      "Design a human-in-the-loop finance process as a portfolio piece",
    ],
  },
  {
    week: 2, level: 2,
    title: "Anomaly Detection, Reporting & Forecasting",
    color: "#c4620a",
    outcomes: [
      "Design exception-based reconciliation workflows at scale",
      "Build an anomaly detection and fraud screening rule library",
      "Produce AI-assisted variance analysis and management reports",
      "Build scenario-based cash flow forecasts with AI",
      "Complete a full AI-assisted month-end review workflow",
    ],
  },
  {
    week: 3, level: 2,
    title: "Audit Readiness, Governance & Policy",
    color: "#a0510a",
    outcomes: [
      "Build an AI audit readiness checklist and evidence pack template",
      "Translate accounting policies into AI-executable decision rules",
      "Design scalable AP/AR operating models with AI",
      "Build a rigorous vendor evaluation scorecard",
      "Complete a full AI governance model for your finance function",
    ],
  },
  {
    week: 4, level: 2,
    title: "Advisory, Transformation & Capstone",
    color: "#7a3e08",
    outcomes: [
      "Design real-time finance monitoring dashboards with AI insights",
      "Build profitability analysis and decision-support frameworks",
      "Produce board-level CFO commentary and executive communication",
      "Build a 90-day AI transformation roadmap for an accounting team",
      "Complete your AI-Ready Accounting Operating Model capstone",
    ],
  },
];

// Backwards-compat default exports
export const weekOverviews = weekOverviewsL1;

// ─────────────────────────────────────────────
// CURRICULUM — LEVEL 1 (28 Days Basic)
// ─────────────────────────────────────────────

export const curriculumL1: DayLesson[] = [

  // ── WEEK 1 ──────────────────────────────────────────────────────────────────
  { day:1, week:1, level:1, category:"Foundations", isMiniProject:false,
    title:"What Accounting Looks Like in the AI Era",
    summary:"Survey how AI tools are changing the day-to-day of accounting in 2026 — from transaction categorisation to management commentary — and where human judgment still leads.",
    task:"List the 5 most time-consuming tasks in your accounting week. For each one, write a single sentence on whether AI could assist, automate, or should stay human-only.",
    tools:["Claude","ChatGPT","Perplexity AI"],
    whyItMatters:"You cannot use AI strategically until you know where it actually adds value in your specific role. This audit is the foundation for everything that follows." },
  { day:2, week:1, level:1, category:"Foundations",
    title:"The Accounting Equation and Double-Entry — Refreshed",
    summary:"Revisit the accounting equation and double-entry bookkeeping through an AI lens — understanding what AI can reliably do with debits/credits and where errors still appear.",
    task:"Ask an AI to explain a double-entry journal for a complex transaction in your work. Check it for errors. Write down what it got right and what it missed.",
    tools:["Claude","ChatGPT"],
    whyItMatters:"Double-entry is the grammar of accounting. Knowing where AI makes mistakes with it makes you a better reviewer — the most valuable skill in AI-assisted accounting." },
  { day:3, week:1, level:1, category:"Foundations",
    title:"Reading Financial Statements with AI Assistance",
    summary:"Learn how to use AI to speed up reading and interpretation of balance sheets, P&Ls, and cash flow statements — and how to verify AI summaries against source documents.",
    task:"Upload or paste a set of financial statements (or use a public company's) and ask AI to summarise the key findings. Verify 3 specific numbers yourself.",
    tools:["Claude","ChatGPT","Gemini"],
    whyItMatters:"Financial statement reading is a core skill that AI can accelerate — but only if you can spot when the AI misreads the numbers or misses a footnote." },
  { day:4, week:1, level:1, category:"Foundations",
    title:"The Modern Finance Tech Stack — Mapping Your Tools",
    summary:"Map the accounting and finance tools in your current stack, identify where AI features already exist, and spot the gaps where AI could make the biggest immediate impact.",
    task:"Create a one-page tech stack map: tool name, what it does, whether it has AI features, and your current usage level. Mark the top 2 AI upgrade opportunities.",
    tools:["Claude","Notion","Google Docs"],
    whyItMatters:"Most accountants are sitting on AI features they have never activated. A stack map turns unknown capability into a prioritised action list." },
  { day:5, week:1, level:1, category:"Foundations",
    title:"Your First AI Accounting Prompt — Getting Useful Output",
    summary:"Learn the three-part prompt structure (instruction, context, format) applied to accounting tasks — and practice getting genuinely useful output from your first accounting-specific prompts.",
    task:"Write and test 3 accounting prompts: one for explaining a concept, one for drafting a journal entry, one for summarising a transaction list. Rate each output 1–5.",
    tools:["Claude","ChatGPT"],
    whyItMatters:"The quality of AI output in accounting is almost entirely determined by prompt quality. This session builds the foundation for every AI interaction that follows." },
  { day:6, week:1, level:1, category:"Foundations",
    title:"AI Errors in Accounting — What to Watch For",
    summary:"Study the most common categories of AI errors in accounting contexts: hallucinated figures, misapplied standards, date errors, and currency confusion — and build your personal review checklist.",
    task:"Ask AI to perform 3 accounting calculations or standard lookups. Deliberately give it one ambiguous input. Document every error or uncertainty you find.",
    tools:["Claude","ChatGPT","Perplexity AI"],
    whyItMatters:"Every accountant using AI needs a personal error checklist. Building it now — before you rely on AI for real work — protects your professional output." },
  { day:7, week:1, level:1, category:"Foundations", isMiniProject:true,
    title:"Mini-Project: Your AI Review Checklist and Finance Stack Map",
    summary:"Produce two portfolio-ready documents: your personal AI review checklist (5 rules for evaluating AI accounting output) and your finance tech stack map with AI opportunities marked.",
    task:"Write your AI review checklist in a shareable format — 5 rules, each with a 1-sentence rationale. Finalise your tech stack map. Both should be professional enough to share with a colleague.",
    tools:["Claude","Google Docs","Notion"],
    whyItMatters:"These are your first two portfolio pieces. They demonstrate professional awareness of AI risks and strategic thinking about your tool environment." },

  // ── WEEK 2 ──────────────────────────────────────────────────────────────────
  { day:8, week:2, level:1, category:"Bookkeeping",
    title:"AI-Assisted Transaction Categorisation — Design and Review",
    summary:"Understand how AI categorisation works in platforms like Xero and QuickBooks, design your own categorisation review process, and build a rule set that reduces manual corrections.",
    task:"Pull 20 recent transactions from your accounting system (or create a sample set). Run them through an AI categorisation review. Document the error rate and the pattern behind the errors.",
    tools:["Xero","QuickBooks","Claude","ChatGPT"],
    whyItMatters:"Transaction categorisation is the highest-volume AI use case in bookkeeping. Designing a good review process saves hours every month." },
  { day:9, week:2, level:1, category:"Bookkeeping",
    title:"Invoice Processing with Document AI and OCR",
    summary:"Learn how OCR and document AI tools extract data from invoices, receipts, and statements — and how to design a capture workflow that minimises manual data entry errors.",
    task:"Test a document AI tool (Dext, Hubdoc, or Claude's document reading) with 3 invoices. Note what fields were extracted correctly, which were wrong, and what you would need to verify manually.",
    tools:["Dext","Hubdoc","Claude","ChatGPT"],
    whyItMatters:"Manual invoice entry is one of the highest-risk, lowest-value tasks in bookkeeping. Document AI eliminates most of it — but only with the right review design." },
  { day:10, week:2, level:1, category:"Bookkeeping",
    title:"Bank Reconciliation with AI Assistance",
    summary:"Design an AI-assisted bank reconciliation workflow — writing matching rules as prompts, handling exceptions, and building a sign-off process that maintains audit integrity.",
    task:"Write a prompt that instructs an AI to match transactions from a bank statement to a ledger. Test it with a sample dataset. Design the exception-handling step for unmatched items.",
    tools:["Claude","ChatGPT","Xero"],
    whyItMatters:"Bank reconciliation is one of the most AI-ready accounting tasks — but most accountants have not yet designed a systematic AI-assisted workflow for it." },
  { day:11, week:2, level:1, category:"Bookkeeping",
    title:"Data Cleaning and Formatting with AI",
    summary:"Use AI to clean messy transaction data: fixing inconsistent descriptions, standardising formats, identifying duplicates, and flagging outliers — without touching complex formulas.",
    task:"Take a messy transaction export (or create one with intentional errors). Use AI to write cleaning instructions or formulas. How much time did it save vs manual cleaning?",
    tools:["Claude","ChatGPT","Microsoft Copilot","Google Workspace"],
    whyItMatters:"Clean data is the prerequisite for every AI accounting use case. Building data cleaning prompts is a compounding investment — every future task benefits." },
  { day:12, week:2, level:1, category:"Bookkeeping",
    title:"Accounts Payable — AI Prompts for Common Tasks",
    summary:"Build a library of AI prompts for the most common AP tasks: payment terms extraction, supplier statement reconciliation, duplicate detection, and payment run summaries.",
    task:"Write 5 AP prompts for your most common tasks. Test each one. For each prompt that works well, write a one-line usage note so a colleague could use it without your help.",
    tools:["Claude","ChatGPT","Xero","QuickBooks"],
    whyItMatters:"AP is prompt-ready — most AP tasks are well-defined enough that a good prompt library can halve the time spent on them." },
  { day:13, week:2, level:1, category:"Bookkeeping",
    title:"Spotting Bookkeeping Errors with AI",
    summary:"Use AI as a bookkeeping error-spotter: identifying common entry errors, unusual account balances, missing transactions, and sign errors before they reach the financial statements.",
    task:"Design 5 bookkeeping error-spotter prompts. Test each one on real or sample data. Which type of error was hardest for AI to catch — and why?",
    tools:["Claude","ChatGPT"],
    whyItMatters:"Error spotting is where AI saves accountants from professional embarrassment. A systematic approach catches what manual review misses." },
  { day:14, week:2, level:1, category:"Bookkeeping", isMiniProject:true,
    title:"Mini-Project: End-to-End Bookkeeping Mini Dataset",
    summary:"Work through a complete bookkeeping cycle using AI assistance: categorise transactions, reconcile to the bank statement, spot errors, and summarise the output in plain English.",
    task:"Using a sample dataset of 15 transactions: categorise all 15, reconcile to a bank statement, identify any errors, and produce a one-paragraph plain-English summary. Document your AI prompts.",
    tools:["Claude","ChatGPT","Xero","Google Sheets"],
    whyItMatters:"This mini-project proves you can combine the week's skills into a complete workflow. The documented prompts become portfolio piece #2." },

  // ── WEEK 3 ──────────────────────────────────────────────────────────────────
  { day:15, week:3, level:1, category:"Reporting",
    title:"Accruals and Prepayments — AI as Your Calculation Partner",
    summary:"Use AI to calculate, explain, and journal accruals and prepayments — and build a review framework that catches timing errors before they distort the financial statements.",
    task:"Give AI 3 accrual scenarios from your work (or use standard examples). Ask it to calculate the journal entries and explain the reasoning. Check each one against your own calculation.",
    tools:["Claude","ChatGPT"],
    whyItMatters:"Accruals are where timing errors hide. AI can accelerate the calculation — but only a trained reviewer catches the logic errors AI sometimes makes." },
  { day:16, week:3, level:1, category:"Bookkeeping",
    title:"Month-End Close — Building an AI-Assisted Checklist",
    summary:"Design a month-end close checklist that integrates AI assistance at each step — specifying what AI does, what the human reviews, and what the sign-off criteria are.",
    task:"Map your current month-end close process (or a standard one). For each step, write: AI action, human review point, and pass/fail criteria. Format as a deployable checklist.",
    tools:["Claude","Google Docs","Notion"],
    whyItMatters:"A documented close checklist with AI integration is immediately deployable and demonstrates both process design and AI governance capability." },
  { day:17, week:3, level:1, category:"Bookkeeping",
    title:"Accounts Receivable — Chaser Emails and Aging Analysis",
    summary:"Use AI to draft AR chaser emails at different overdue stages, analyse aging reports for collection risk, and write prompts for the most common AR communication tasks.",
    task:"Draft 3 AR chaser emails: 7 days overdue (polite), 30 days (firm), 60 days (urgent). Use AI to write the first draft of each. Edit to match your organisation's tone.",
    tools:["Claude","ChatGPT"],
    whyItMatters:"AR communication is high-volume and tone-sensitive. A template library built with AI saves hours per week and reduces collection risk." },
  { day:18, week:3, level:1, category:"Controls & Ethics",
    title:"Internal Controls — Understanding Segregation of Duties",
    summary:"Learn the key internal control concepts every accountant needs — segregation of duties, authorisation limits, reconciliation controls — and how AI changes the control environment.",
    task:"Map the segregation of duties in one process you own. Identify any gaps or risks. Ask AI to suggest 3 additional controls. Evaluate whether they are practical in your context.",
    tools:["Claude","ChatGPT"],
    whyItMatters:"Controls knowledge protects your organisation and your professional reputation. AI introduces new control considerations that every accountant needs to understand." },
  { day:19, week:3, level:1, category:"Controls & Ethics",
    title:"Expense Management — AI Policy Compliance Checking",
    summary:"Use AI to check expense claims against policy, flag potential violations, and draft policy summaries in plain English — designing a compliance workflow that is both efficient and robust.",
    task:"Take 10 expense line items (real or sample). Write a prompt that instructs AI to check each against a policy. How accurately does it flag violations? What did it miss?",
    tools:["Claude","ChatGPT"],
    whyItMatters:"Expense compliance checking is one of the clearest AI wins in accounting — high volume, rule-based, and currently taking far too much manual review time." },
  { day:20, week:3, level:1, category:"Controls & Ethics",
    title:"AI Ethics in Accounting — Your Personal Usage Policy",
    summary:"Develop a personal AI ethics and usage policy for your accounting practice — covering data confidentiality, output verification, disclosure, and the limits of AI in professional work.",
    task:"Write your personal AI accounting usage policy: 5 rules, each with a one-sentence rationale. Cover: what data you will not share with AI, how you verify AI output, and when AI output must be disclosed.",
    tools:["Claude","Google Docs"],
    whyItMatters:"A documented personal AI policy is a professional asset. It protects you legally and demonstrates the kind of responsible AI adoption that clients and employers value." },
  { day:21, week:3, level:1, category:"Controls & Ethics", isMiniProject:true,
    title:"Mini-Project: Month-End Checklist and Ethics Policy",
    summary:"Finalise two portfolio pieces: your AI-assisted month-end close checklist and your personal AI ethics and usage policy — both formatted for professional use.",
    task:"Polish both documents to professional standard. Each should be clear enough for a colleague to use without explanation. The ethics policy should reflect your actual work context.",
    tools:["Claude","Google Docs","Notion"],
    whyItMatters:"These two documents signal AI maturity to any employer or client. A close checklist shows process design skill; an ethics policy shows professional responsibility." },

  // ── WEEK 4 ──────────────────────────────────────────────────────────────────
  { day:22, week:4, level:1, category:"Tax & Compliance",
    title:"AI for Tax Research — Safe and Effective Use",
    summary:"Learn how to use AI for tax research safely — understanding its limitations, the right prompt structure for regulatory queries, and how to verify AI tax output against primary sources.",
    task:"Research one tax rule relevant to your work using AI. Then verify the AI's answer against the primary source (tax authority website or official guidance). What did AI get right? What did it miss?",
    tools:["Claude","Perplexity AI","ChatGPT"],
    whyItMatters:"Tax is a high-risk area for AI errors. Knowing how to use AI for tax research — and how to verify it — is a skill that protects both you and your clients." },
  { day:23, week:4, level:1, category:"Reporting",
    title:"Variance Analysis — Turning Numbers into Narrative",
    summary:"Use AI to transform a set of financial variances into clear management commentary — learning the prompt structure that produces concise, accurate, and professionally appropriate narrative.",
    task:"Take 5 budget vs actual variances (real or sample). Write a prompt that produces management commentary for each. Edit the AI output to match your organisation's reporting style.",
    tools:["Claude","ChatGPT"],
    whyItMatters:"Variance commentary is time-consuming and often poorly done. AI can produce a solid first draft in seconds — saving the time for analysis, not writing." },
  { day:24, week:4, level:1, category:"Reporting",
    title:"Client Communication — Finance Narratives in Plain English",
    summary:"Use AI to draft client-facing finance communications: monthly reports, query responses, and explanation notes — maintaining professional tone while making numbers accessible.",
    task:"Write 3 client communication prompts: a monthly summary, a response to a query about an unusual expense, and an explanation of a tax liability. Edit each for your actual client context.",
    tools:["Claude","ChatGPT"],
    whyItMatters:"Translating financial information into plain English is a high-value skill. AI drafts the communication; your judgment makes it accurate and appropriately toned." },
  { day:25, week:4, level:1, category:"Reporting",
    title:"KPI Dashboards — AI for Metric Calculation and Commentary",
    summary:"Use AI to define, calculate, and write commentary for the 5 most important KPIs in your accounting context — building a repeatable dashboard narrative workflow.",
    task:"Define 5 KPIs for your context. Ask AI to write the calculation logic and a commentary template for each. Test it with sample data. Which KPIs produced the most useful AI output?",
    tools:["Claude","ChatGPT","Microsoft Copilot"],
    whyItMatters:"KPI commentary is produced every month. A templated AI workflow eliminates the blank-page problem and ensures consistency across reporting periods." },
  { day:26, week:4, level:1, category:"Reporting",
    title:"Building Your Accountant Prompt Library",
    summary:"Consolidate every useful prompt you have built across 25 days into a structured, categorised prompt library — your most immediately deployable portfolio piece.",
    task:"Organise your prompts into 6 categories: bookkeeping, reconciliation, reporting, tax, communication, and controls. For each, document: the task, the prompt, and a sample output. Aim for 10+ prompts.",
    tools:["Claude","Notion","Google Docs"],
    whyItMatters:"A prompt library is a professional asset that compounds in value. Every task you systematise this week saves time every month from now on." },
  { day:27, week:4, level:1, category:"Mixed",
    title:"Pulling It Together — Your AI-Assisted Accounting Workflow",
    summary:"Design the complete AI-assisted accounting workflow you will actually use — mapping each stage from transaction capture to reporting, with AI tools, human review points, and quality gates.",
    task:"Map your ideal AI-assisted monthly accounting workflow. For each stage: which AI tool, what it produces, what you review, and the sign-off criterion. One page, deployable from Monday.",
    tools:["Claude","Notion","Google Docs"],
    whyItMatters:"This workflow is your capstone foundation. It represents the practical synthesis of 27 days of learning — and it is immediately usable in your real work." },
  { day:28, week:4, level:1, category:"Mixed", isMiniProject:true,
    title:"Capstone — AI-Assisted Monthly Accounting Workflow",
    summary:"Complete and submit your 28-day capstone: a professional one-page AI-Assisted Monthly Accounting Workflow covering every stage from transaction capture to reporting.",
    task:"Finalise your workflow document to professional standard. It should include: transaction capture, bookkeeping, reconciliation, month-end close, variance analysis, and reporting — with AI actions, human review points, and your personal usage policy integrated throughout.",
    tools:["Claude","Google Docs","Notion"],
    whyItMatters:"This capstone is a genuine professional document — deployable in your actual work and strong enough to share with clients or include in a professional portfolio." },
];

// ─────────────────────────────────────────────
// CURRICULUM — LEVEL 2 (28 Days Advanced)
// ─────────────────────────────────────────────

export const curriculumL2: DayLesson[] = [

  // ── WEEK 1 ──────────────────────────────────────────────────────────────────
  { day:1, week:1, level:2, category:"Strategy",
    title:"The 2026 Finance Function — From Bookkeeping to Real-Time Advisory",
    summary:"Survey the structural shift in accounting and finance: from periodic reporting to continuous monitoring, from manual review to AI-assisted controls. Map where your finance function sits on this spectrum and where it needs to go.",
    task:"Produce a one-page AI readiness assessment for your finance function. Rate each of 8 accounting processes (1–5) on AI maturity. Identify your top 3 priority use cases and bottom 2 risks.",
    tools:["Claude","ChatGPT","Google Docs"],
    whyItMatters:"Strategy starts with an honest current-state assessment. This document becomes the baseline against which you measure transformation progress." },
  { day:2, week:1, level:2, category:"Strategy",
    title:"AI Use Case Prioritisation — The Finance Function Matrix",
    summary:"Apply a 2×2 feasibility-impact matrix to the AI use cases in your finance function. Build a prioritised list that accounts for data readiness, regulatory constraints, and implementation complexity.",
    task:"Map 8+ AI use cases for your finance function onto the feasibility-impact matrix. Produce a ranked shortlist of your top 5 with a one-line rationale for each. Format for a CFO audience.",
    tools:["Claude","Google Sheets","Miro"],
    whyItMatters:"Prioritisation is the most important strategic decision in AI transformation. A structured matrix prevents the common mistake of chasing exciting use cases over high-value ones." },
  { day:3, week:1, level:2, category:"Workflows",
    title:"Designing the AI-Assisted Month-End Close",
    summary:"Redesign the month-end close process with AI integrated at each step — from pre-close data preparation to final review sign-off. Build a documented process blueprint that is both efficient and audit-ready.",
    task:"Produce a Close Process Blueprint in table format: step, owner, AI action, human review point, time estimate, and pass/fail criterion. Cover at least 8 steps from data lock to signed-off financials.",
    tools:["Claude","Google Docs","Notion"],
    whyItMatters:"The month-end close is the highest-value process to redesign with AI. A documented blueprint is immediately deployable and demonstrates senior-level workflow design capability." },
  { day:4, week:1, level:2, category:"Workflows",
    title:"Advanced Prompt Engineering for Accounting",
    summary:"Master the structured prompt techniques that produce reliable accounting output: chain-of-thought for complex calculations, few-shot examples for consistent formatting, and role prompting for different stakeholder audiences.",
    task:"Write 5 advanced accounting prompts — one chain-of-thought, one few-shot, one role-based, one constraint-heavy, one multi-step. Test each and rate output quality. Document what made each one work.",
    tools:["Claude","ChatGPT"],
    whyItMatters:"Advanced prompt engineering is what separates basic AI use from senior-level AI deployment. Each technique solves a different class of accounting problem." },
  { day:5, week:1, level:2, category:"Workflows",
    title:"Reusable Workflow Design — AI, Spreadsheets, and Rules",
    summary:"Design reusable accounting workflows that combine AI prompts, spreadsheet logic, and explicit rules — creating systematic processes that any team member can run consistently.",
    task:"Design one reusable accounting workflow (e.g., invoice review, variance analysis, bank rec). Document it as a step-by-step SOP with: inputs, AI step, human step, output specification, and quality check.",
    tools:["Claude","Google Sheets","Notion"],
    whyItMatters:"Reusable workflows multiply your impact. A workflow you document once saves time every month for every person who runs it." },
  { day:6, week:1, level:2, category:"Controls & Governance",
    title:"Human-in-the-Loop Design for Finance Processes",
    summary:"Design the human oversight layer for AI-assisted finance processes — determining which decisions require human review, what evidence standards are needed, and how to build escalation paths that work under time pressure.",
    task:"Select one AI-assisted finance process and design the full human-in-the-loop architecture: decision triggers, reviewer qualifications, escalation path, evidence requirements, and audit trail specification.",
    tools:["Claude","Miro","Google Docs"],
    whyItMatters:"Human-in-the-loop design is what makes AI-assisted accounting defensible to auditors and regulators. Getting this right is the governance foundation of every AI finance deployment." },
  { day:7, week:1, level:2, category:"Workflows", isMiniProject:true,
    title:"Mini-Project: Close Blueprint and Human-in-the-Loop Design",
    summary:"Finalise two senior-level portfolio pieces: your Close Process Blueprint and your Human-in-the-Loop Process Design — both formatted for a CFO or audit committee audience.",
    task:"Polish both documents to board-ready standard. The Close Blueprint should be deployable. The Human-in-the-Loop Design should be defensible to an auditor. Both should demonstrate governance maturity.",
    tools:["Claude","Google Docs","Canva"],
    whyItMatters:"These documents mark a clear line between basic AI use and strategic AI deployment. They are consulting-grade deliverables that demonstrate senior finance capability." },

  // ── WEEK 2 ──────────────────────────────────────────────────────────────────
  { day:8, week:2, level:2, category:"Controls & Governance",
    title:"Exception-Based Reconciliation at Scale",
    summary:"Design AI-assisted reconciliation workflows built around exception detection rather than line-by-line matching — dramatically improving efficiency while maintaining control quality.",
    task:"Redesign one reconciliation process using exception-based logic. Define your matching rules, exception criteria, and review thresholds. Write the AI prompt that implements your matching logic.",
    tools:["Claude","ChatGPT","Xero","Google Sheets"],
    whyItMatters:"Exception-based reconciliation is how senior accountants scale their review capacity. Designing this workflow is a direct productivity multiplier." },
  { day:9, week:2, level:2, category:"Controls & Governance",
    title:"Anomaly Detection — Building Your Finance Rule Library",
    summary:"Build a systematic anomaly detection rule library for your finance function — covering transaction outliers, pattern breaks, duplicate risks, and unusual account movements.",
    task:"Write 8+ anomaly detection rules across 5 categories (transaction, balance, pattern, duplicate, timing). For each rule, write the AI prompt that implements it and the threshold that triggers a review.",
    tools:["Claude","ChatGPT","Google Sheets"],
    whyItMatters:"Anomaly detection is AI's clearest competitive advantage in accounting. A documented rule library is both a control tool and a demonstration of advanced AI governance." },
  { day:10, week:2, level:2, category:"Controls & Governance",
    title:"Fraud Risk Screening with AI",
    summary:"Apply AI to fraud risk screening: identifying red flags in transaction data, supplier behaviour, expense patterns, and payroll anomalies — while maintaining proportionate and legally sound processes.",
    task:"Design a fraud screening checklist covering 4 risk areas. For each area, write 3 AI prompts that screen for specific red flags. Include the human review step required for each positive result.",
    tools:["Claude","ChatGPT","Perplexity AI"],
    whyItMatters:"Fraud detection is a high-stakes, high-value AI use case. A structured screening process — rather than ad-hoc checks — is what professional-standard AI deployment looks like." },
  { day:11, week:2, level:2, category:"Reporting",
    title:"Variance Analysis at Speed — AI-Assisted Commentary",
    summary:"Build a systematic AI-assisted variance analysis workflow — from data preparation to management commentary — that produces consistent, accurate narrative in a fraction of the manual time.",
    task:"Design a variance analysis prompt template for your reporting context. Include: data input format, analysis instruction, narrative specification, and tone guidance. Test with real or sample data.",
    tools:["Claude","ChatGPT","Microsoft Copilot"],
    whyItMatters:"Variance commentary is produced every month. A systematic AI workflow eliminates inconsistency and frees senior time for analysis rather than drafting." },
  { day:12, week:2, level:2, category:"Reporting",
    title:"Cash Flow Forecasting with AI-Assisted Scenario Analysis",
    summary:"Use AI to build scenario-based cash flow forecasts — writing prompts for base, optimistic, and stress scenarios — and design the narrative that accompanies each forecast for management use.",
    task:"Build a scenario analysis prompt framework for cash flow: inputs, scenario definitions, forecast logic, and narrative format. Produce a base and stress scenario for a sample business.",
    tools:["Claude","ChatGPT","Google Sheets"],
    whyItMatters:"Scenario-based forecasting is a CFO-level capability. AI dramatically accelerates the modelling — your value is in the scenario design and the narrative judgment." },
  { day:13, week:2, level:2, category:"Reporting",
    title:"Management Reporting — AI-Assisted Pack Production",
    summary:"Design an AI-assisted management reporting workflow — from data pull to final pack — covering KPI commentary, variance narrative, and executive summary production.",
    task:"Map your management reporting process end-to-end. Identify every step where AI can accelerate output. Write 3 management report prompts: KPI commentary, variance summary, and executive narrative.",
    tools:["Claude","ChatGPT","Microsoft Copilot","Google Workspace"],
    whyItMatters:"Management reporting is the highest-visibility output in finance. AI assistance here has direct impact on reporting quality, timeliness, and your professional reputation." },
  { day:14, week:2, level:2, category:"Workflows", isMiniProject:true,
    title:"Mini-Project: Month-End Review Workflow",
    summary:"Produce a complete AI-assisted month-end review workflow: pre-close checklist, variance prompt template, anomaly detection rules, commentary specification, and quality review checklist.",
    task:"Integrate the week's work into one cohesive workflow document. It should cover: pre-close data checks, AI-assisted variance analysis, anomaly detection run, commentary production, and CFO sign-off package.",
    tools:["Claude","Google Docs","Notion"],
    whyItMatters:"This is your most comprehensive workflow deliverable. It demonstrates the ability to design, document, and integrate multiple AI use cases into a deployable senior-level process." },

  // ── WEEK 3 ──────────────────────────────────────────────────────────────────
  { day:15, week:3, level:2, category:"Controls & Governance",
    title:"Audit Readiness — Building the AI Evidence Pack",
    summary:"Design an AI evidence pack template that captures the full audit trail for AI-assisted accounting decisions: input data, prompt used, AI output, reviewer sign-off, changes made, and rationale.",
    task:"Build a reusable AI evidence pack template. It should be completable in under 5 minutes per AI-assisted task and produce documentation that satisfies both internal audit and external auditor requirements.",
    tools:["Claude","Google Docs","Notion"],
    whyItMatters:"Evidence packs are what transform informal AI use into professionally defensible practice. Without them, AI-assisted accounting is a liability rather than an asset." },
  { day:16, week:3, level:2, category:"Controls & Governance",
    title:"AI Audit Readiness Checklist — 15 Items, 5 Categories",
    summary:"Build a comprehensive audit readiness checklist for AI-assisted finance: covering documentation, controls, data quality, review processes, and regulatory compliance.",
    task:"Develop a 15-item audit readiness checklist across 5 categories. For each item: the requirement, the evidence standard, who owns it, and how to assess compliance. Format for quarterly self-assessment.",
    tools:["Claude","Google Docs"],
    whyItMatters:"Audit readiness is not a one-time project — it is an ongoing governance discipline. A checklist makes it systematic and auditable in itself." },
  { day:17, week:3, level:2, category:"Controls & Governance",
    title:"Policy Translation — From Rules to AI-Executable Logic",
    summary:"Translate accounting policies, compliance rules, and control requirements into AI-executable IF-THEN logic — making policies actionable in your AI-assisted workflows.",
    task:"Select 3 accounting policies (expense, revenue recognition, or disclosure). Translate each into IF-THEN rules an AI can apply. Test each translation with sample data. Document edge cases.",
    tools:["Claude","ChatGPT"],
    whyItMatters:"Policy translation is a senior skill — bridging the gap between written rules and automated execution. It is also the first step toward systematic compliance checking." },
  { day:18, week:3, level:2, category:"Tax & Compliance",
    title:"Tax Research Protocol — Multi-Step AI Verification",
    summary:"Design a rigorous multi-step tax research protocol using AI: defining the research question, using AI for initial research, verifying against primary sources, and documenting the conclusion.",
    task:"Research one complex tax question using your protocol. Document each step: AI query, AI output, primary source verification, discrepancies found, and final conclusion. Total time: under 30 minutes.",
    tools:["Claude","Perplexity AI","ChatGPT"],
    whyItMatters:"Tax research with AI is only valuable if it is also defensible. A documented protocol is what turns AI-assisted tax research into professional-standard practice." },
  { day:19, week:3, level:2, category:"Controls & Governance",
    title:"AP and AR Operating Models with AI",
    summary:"Design scalable AI-assisted operating models for AP and AR — covering workflow design, AI integration points, control frameworks, exception handling, and performance metrics.",
    task:"Design one AP or AR operating model with AI integrated. Include: process flow, AI actions, human review points, KPIs, and controls. Format as a one-page operating model diagram with notes.",
    tools:["Claude","Miro","Google Docs"],
    whyItMatters:"AP and AR operating models define how a finance function actually runs. Designing AI into them at the architecture level — not as a retrofit — is the mark of a strategic finance leader." },
  { day:20, week:3, level:2, category:"Controls & Governance",
    title:"Vendor Evaluation — AI Scorecard for Finance Tools",
    summary:"Build a rigorous vendor evaluation scorecard for AI-powered finance tools — covering capability, data handling, integration, regulatory compliance, vendor stability, and total cost of ownership.",
    task:"Build a 10-criterion scorecard. Apply it to evaluate one finance AI tool you are considering. Produce a recommendation with evidence for each criterion. Format for a CFO decision meeting.",
    tools:["Claude","Perplexity AI","Google Sheets"],
    whyItMatters:"Finance teams are being sold AI tools aggressively. A rigorous evaluation scorecard protects against poor procurement decisions and demonstrates strategic technology governance." },
  { day:21, week:3, level:2, category:"Controls & Governance", isMiniProject:true,
    title:"Mini-Project: AI Governance Model for Your Finance Function",
    summary:"Produce a complete AI governance model for your finance function: roles, approval matrix, escalation paths, incident response plan, and review cadence — in a format ready for CFO or audit committee review.",
    task:"Build your governance model in one document. It must cover: who can use AI for what, who reviews AI output, how errors are escalated, how incidents are handled, and how the governance is reviewed. One page, deployable.",
    tools:["Claude","Google Docs","Canva"],
    whyItMatters:"An AI governance model is what separates individual AI use from organisational AI deployment. It is the document that protects your finance function — and your career — when things go wrong." },

  // ── WEEK 4 ──────────────────────────────────────────────────────────────────
  { day:22, week:4, level:2, category:"Advisory",
    title:"Real-Time Finance Monitoring — Dashboard Design with AI",
    summary:"Design a real-time finance monitoring dashboard: defining the 8–10 KPIs that matter, the alert thresholds, the AI-generated insight layer, and the management action framework.",
    task:"Design a finance monitoring dashboard for your context. Define 8 KPIs, their calculation logic, alert thresholds, and the AI prompt that generates the insight commentary for each. Mockup the layout.",
    tools:["Claude","ChatGPT","Microsoft Copilot","Canva"],
    whyItMatters:"Real-time monitoring is the destination of AI-assisted accounting. Designing the dashboard is the capstone of the analytical capability you have built across 22 days." },
  { day:23, week:4, level:2, category:"Advisory",
    title:"Profitability Analysis and Decision Support",
    summary:"Build an AI-assisted profitability analysis framework — from data inputs to CFO brief — covering product, customer, or segment profitability with scenario analysis and decision recommendations.",
    task:"Design a profitability analysis prompt framework for one relevant segment. Test it with sample data. Produce a one-page CFO brief using AI assistance. How much of the final brief is AI vs your judgment?",
    tools:["Claude","ChatGPT","Google Sheets"],
    whyItMatters:"Profitability analysis is advisory work — the highest-value output of a senior finance professional. AI accelerates the analysis; your judgment drives the recommendation." },
  { day:24, week:4, level:2, category:"Advisory",
    title:"CFO-Level Communication — Board Packs and Executive Commentary",
    summary:"Use AI to produce board-level finance communication: CFO commentary, executive summaries, and risk response narratives — maintaining strategic framing and appropriate tone for senior audiences.",
    task:"Draft a CFO commentary for a set of financial results using AI. Include: headline performance, key variances, forward outlook, and risk factors. Edit the output to reflect senior executive communication standards.",
    tools:["Claude","ChatGPT","Microsoft Copilot"],
    whyItMatters:"Board-level communication is a senior finance skill that AI can now support. The ability to produce high-quality CFO commentary quickly is a direct career differentiator." },
  { day:25, week:4, level:2, category:"Advisory",
    title:"Client Advisory — AI-Powered Business Performance Reviews",
    summary:"Design an AI-assisted business performance review methodology for client advisory work — from data analysis to insight narrative to client communication — covering the full advisory workflow.",
    task:"Design a client performance review workflow using AI. Include: data inputs, analysis prompts, insight generation, narrative drafting, and client communication. Test with a sample client scenario.",
    tools:["Claude","ChatGPT","Google Docs"],
    whyItMatters:"Client advisory is the highest-value output of an accounting professional. AI assistance here multiplies both the quality and the number of clients you can serve." },
  { day:26, week:4, level:2, category:"Strategy",
    title:"The 90-Day AI Transformation Roadmap",
    summary:"Build a practical 90-day AI transformation roadmap for your accounting team or finance function — covering quick wins, capability building, governance implementation, and measurable outcomes.",
    task:"Produce a 90-day roadmap in three phases (30/60/90 days). For each phase: 3 actions, the owner, the resource requirement, and the success metric. Format for a CFO or CEO presentation.",
    tools:["Claude","Google Slides","Canva"],
    whyItMatters:"A 90-day roadmap is what turns AI aspiration into organisational action. It is the deliverable that gets buy-in, budget, and accountability — the prerequisites for real transformation." },
  { day:27, week:4, level:2, category:"Strategy",
    title:"Automation Design — End-to-End Process Transformation",
    summary:"Design a complete end-to-end automation for one accounting process: current state, future state, tool selection, control framework, evidence standards, and implementation plan.",
    task:"Produce a full automation design document for one process. Include: as-is process map, to-be design, AI and tool selection rationale, controls, evidence pack requirement, and 60-day implementation plan.",
    tools:["Claude","Miro","Google Docs"],
    whyItMatters:"End-to-end automation design is the capstone analytical skill of the Advanced track. It integrates every capability developed across 27 days into one strategic deliverable." },
  { day:28, week:4, level:2, category:"Mixed", isMiniProject:true,
    title:"Final Capstone — Your AI-Ready Accounting Operating Model",
    summary:"Produce your AI-Ready Accounting Operating Model: an 8-section strategic document covering vision, use cases, governance, workflows, evidence standards, team development, 90-day roadmap, and personal reflection.",
    task:"Complete all 8 sections: (1) Finance function vision, (2) Top 5 AI use cases with ROI estimates, (3) Governance model, (4) Workflow designs for 2 core processes, (5) Evidence and audit trail standards, (6) Team skills development plan, (7) 90-day implementation roadmap, (8) Personal reflection paragraph.",
    tools:["Claude","ChatGPT","Google Docs","Canva","Notion"],
    whyItMatters:"This operating model is a boardroom-ready document — evidence of 28 days of structured senior-level learning and a practical blueprint for transforming a finance function with AI." },
];

// Backwards-compat default
export const curriculum = curriculumL1;

// ─────────────────────────────────────────────
// SYSTEMS SUMMARY
// ─────────────────────────────────────────────

export const systemsSummaryL1 = [
  { week:1, title:"Foundations & AI Context", systems:["AI review checklist — 5 rules for evaluating AI accounting output","Finance tech stack map — tools, AI features, and manual gaps","Financial statements plain-English summary framework","Double-entry verification habit with AI as practice partner","First prompt: AI as accounting explainer and tutor"] },
  { week:2, title:"Bookkeeping Workflow SOPs", systems:["Transaction categorisation review checklist (5 rules)","Invoice data extraction field checklist","Reconciliation prompt library (3 core rules)","Bookkeeping error spotter prompt list (5 prompts)","Data cleaning SOP (5-step, plain English)"] },
  { week:3, title:"Month-End & Controls", systems:["Month-end close checklist with AI and human review steps","AP process map with control classifications (A/B/C)","AR email template library (3 chaser tones)","Expense policy + AI compliance check prompt","Personal AI ethics and usage policy (5 rules)"] },
  { week:4, title:"Reporting & Communication", systems:["Tax research prompt framework (process + sources + flags)","Variance commentary prompt specification","Client communication template set (update, explanation, summary)","KPI calculation and narrative prompt set (5 KPIs)","Personal accountant prompt library (10+ prompts, 6 categories)"] },
];

export const systemsSummaryL2 = [
  { week:1, title:"AI Close Design & Workflow Architecture", systems:["Finance function AI readiness assessment (one-page)","AI use case priority matrix (2x2, 8+ use cases)","Close Process Blueprint (step, time, AI action, human review)","Advanced prompt library (5 structured prompts, 5 categories)","Human-in-the-loop process design with escalation path"] },
  { week:2, title:"Anomaly Detection & Reporting", systems:["Exception-based reconciliation workflow (matching rules + KPIs)","Anomaly detection rule library (8+ rules, 5 categories)","Fraud risk screening checklist (4 areas × 3 prompts)","Variance analysis prompt template (actuals + budget + narrative)","Month-end review workflow (pre-close + analysis + sign-off)"] },
  { week:3, title:"Governance & Policy Design", systems:["AI audit readiness checklist (15+ items, 5 categories)","AI evidence pack template (input → prompt → output → sign-off)","Policy-to-IF-THEN rules framework (3 policies translated)","Tax research protocol (multi-step prompt + source verification)","AI governance model (roles, approval matrix, escalation, incident response)"] },
  { week:4, title:"Advisory & Transformation", systems:["Finance monitoring dashboard design (8-10 KPIs + alert logic)","Profitability analysis prompt framework (input → analysis → CFO brief)","Board communication templates (CFO commentary, exec summary, risk response)","90-day AI transformation roadmap (3 phases, actions, metrics)","AI-Ready Accounting Operating Model (8-section capstone document)"] },
];

export const systemsSummary = systemsSummaryL1;

// ─────────────────────────────────────────────
// METRICS TO TRACK
// ─────────────────────────────────────────────

export const metricsToTrack = [
  { metric:"Prompt Quality", why:"Track how often your first AI prompt gives usable output without heavy editing. Improving this is the fastest way to save time on recurring accounting tasks." },
  { metric:"Review Time per Task", why:"Measure how long it takes to review and correct AI output vs doing it manually. This is your personal productivity case for AI adoption." },
  { metric:"Errors Caught", why:"Track how many AI suggestions you correct or reject per session. A high rate signals your prompts or data need work." },
  { metric:"Prompt Library Size", why:"Count the reusable prompts you have built. Each one represents a recurring task you have systematised. Aim for 10 by Day 28." },
];

// ─────────────────────────────────────────────
// STARTER TOOLKIT (combined)
// ─────────────────────────────────────────────

export const starterToolkit: ToolkitItem[] = [
  { name:"Claude", url:"https://claude.ai", category:"AI Assistant", desc:"Best for structured reasoning, long documents, and complex accounting instructions. First choice for governance frameworks, policy analysis, and management commentary." },
  { name:"ChatGPT", url:"https://chat.openai.com", category:"AI Assistant", desc:"Strong for drafting, summarising, and explaining accounting concepts. Note: geo-blocked in HK — use Gemini or Claude instead." },
  { name:"Gemini", url:"https://gemini.google.com", category:"AI Assistant", desc:"Google's AI — recommended for Hong Kong users. Built into Google Docs and Sheets for seamless accounting workflows." },
  { name:"Perplexity AI", url:"https://perplexity.ai", category:"AI Assistant", desc:"AI research with source citations. Best for tax rule lookups, standard references, and regulatory summaries." },
  { name:"Xero", url:"https://xero.com", category:"Accounting Platform", desc:"Cloud accounting with AI transaction categorisation, bank reconciliation, and reporting. Most widely used SME platform in 2026." },
  { name:"QuickBooks", url:"https://quickbooks.intuit.com", category:"Accounting Platform", desc:"AI-assisted bookkeeping, cash flow forecasting, and expense management. Strong in the US and globally used." },
  { name:"Dext", url:"https://dext.com", category:"Document AI", desc:"OCR and AI document extraction for invoices, receipts, and bank statements. Integrates with Xero and QuickBooks." },
  { name:"Hubdoc", url:"https://hubdoc.com", category:"Document AI", desc:"Automated document collection and data extraction. Fetches bills and statements from supplier portals." },
  { name:"Microsoft Copilot", url:"https://copilot.microsoft.com", category:"Productivity", desc:"AI in Excel for formula writing, data cleaning, financial modelling, and dashboard design. In Word for management commentary and board packs." },
  { name:"Google Workspace", url:"https://workspace.google.com", category:"Productivity", desc:"Docs, Sheets, and Drive with Gemini built in. Use for all deliverable production — board packs, operating models, and governance frameworks." },
  { name:"Notion", url:"https://notion.so", category:"Productivity", desc:"Build your prompt library, store SOPs, governance models, and evidence pack templates." },
  { name:"Canva", url:"https://canva.com", category:"Productivity", desc:"Professional visual deliverables: process diagrams, governance charts, dashboard mockups, and transformation roadmap visuals." },
];

// ─────────────────────────────────────────────
// PORTFOLIO TARGETS
// ─────────────────────────────────────────────

export const portfolioTargets: PortfolioTarget[] = [
  { title:"AI Review Checklist", week:1, level:1, desc:"5 personal rules for evaluating AI accounting output — your first professional AI governance document." },
  { title:"Finance Tech Stack Map", week:1, level:1, desc:"A visual map of your accounting tool stack with AI features marked." },
  { title:"Bookkeeping Error Spotter Prompts", week:2, level:1, desc:"5 reusable AI prompts for catching common bookkeeping errors." },
  { title:"Mini Dataset Lab", week:2, level:1, desc:"End-to-end worked example: 15 transactions categorised, reconciled, and summarised in plain English." },
  { title:"Month-End Close Checklist", week:3, level:1, desc:"A 5-step AI-assisted close checklist with AI actions, human review points, and sign-off requirements." },
  { title:"AR Email Template Library", week:3, level:1, desc:"3 professionally drafted payment chaser emails at different overdue stages." },
  { title:"Personal AI Ethics Policy", week:3, level:1, desc:"5 personal rules governing AI use in your finance work." },
  { title:"Accountant Prompt Library", week:4, level:1, desc:"10+ reusable prompts across 6 accounting categories." },
  { title:"AI-Assisted Monthly Accounting Workflow", week:4, level:1, desc:"28-day capstone: a one-page workflow from transaction capture to reporting with AI tools and human review points." },
  { title:"Human-in-the-Loop Process Design", week:1, level:2, desc:"A fully mapped finance process with AI steps, human review points, and escalation paths." },
  { title:"Month-End Review Workflow", week:2, level:2, desc:"Complete AI-assisted month-end workflow: pre-close checklist, variance prompts, anomaly rules, commentary spec." },
  { title:"AI Evidence Pack Template", week:3, level:2, desc:"A reusable documentation template capturing the full AI audit trail for any accounting decision." },
  { title:"AI Governance Model", week:3, level:2, desc:"One-page governance framework with roles, approval matrix, escalation paths, and incident response." },
  { title:"End-to-End Automation Design", week:4, level:2, desc:"Complete automation design for one process: as-is, to-be, tool selection, controls, and implementation plan." },
  { title:"AI-Ready Accounting Operating Model", week:4, level:2, desc:"28-day capstone: an 8-section strategic document covering vision, use cases, governance, workflows, and 90-day roadmap." },
];
