import { useState, useRef, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Send, Bot, User, Sparkles, ChevronDown, ChevronUp, Key } from "lucide-react";
import { Link } from "wouter";
import type { DayLesson } from "@/data/curriculum";
import { useLanguage } from "@/i18n";

interface Message {
  role: "user" | "assistant";
  content: string;
}

function buildDayContext(day: DayLesson): string {
  return `Day ${day.day}: "${day.title}"
Category: ${day.category}
Lesson: ${day.summary}
Today's Task: ${day.task}
Tools used: ${day.tools.join(", ")}
Why it matters: ${day.whyItMatters}`;
}

const STARTER_QUESTIONS: Record<number, string[]> = {
  // Week 1 — Foundations
  1: ["How is AI actually being used in accounting firms right now?", "What repetitive accounting tasks can AI handle today?", "What should I expect to learn in this 28-day challenge?"],
  2: ["Can you give me a quick example of a debit and credit entry?", "What is the accounting equation and why does it matter?", "How does AI help with transaction coding in practice?"],
  3: ["Can you walk me through a journal entry flowing into a ledger?", "What does a trial balance actually check for?", "How do cloud accounting systems like Xero handle this automatically?"],
  4: ["Can you generate a simple income statement for a fictional business?", "What is the difference between the income statement and cash flow statement?", "How do the three financial statements connect to each other?"],
  5: ["What AI features does Xero have built in right now?", "What is a bank feed and how does it save time?", "How does Microsoft Copilot work inside Excel for accounting?"],
  6: ["Can you draft a client email about an overdue invoice for me?", "What accounting tasks is AI genuinely good at vs. overhyped for?", "Can you summarise last month's expenses in plain English from these numbers?"],
  7: ["Can you produce a journal entry for a lease payment so I can review it?", "What is the difference between capital and revenue expenditure?", "Help me build my 5-rule AI review checklist for accounting outputs."],

  // Week 2 — Bookkeeping Workflows
  8: ["What should my review checklist for AI-suggested GL codes include?", "How does Xero learn from corrections I make to transaction categories?", "Give me an example of a transaction that AI commonly miscodes and why."],
  9: ["What is the minimum data an AI should extract from an invoice?", "How does OCR work in tools like Dext or Hubdoc?", "Write a prompt that extracts invoice data and flags missing fields."],
  10: ["Can you write me 3 reconciliation rules as AI prompts I can reuse?", "What is a timing difference in bank reconciliation and how does AI spot it?", "How do I set up bank rules in Xero to automate matching?"],
  11: ["What are the most common bookkeeping errors AI can help catch?", "Can you write a prompt that checks for duplicate payments in a transaction list?", "How do I spot a transposition error in a trial balance?"],
  12: ["Can you show me a weak prompt vs a strong prompt for the same accounting task?", "Help me write a prompt that turns variance bullet points into a board summary.", "What context should I always include in an accounting prompt?"],
  13: ["Can you write an Excel formula to standardise inconsistent vendor names?", "How do I use AI to clean a messy CSV export from my accounting software?", "What does a 5-step data cleaning SOP look like for accounting data?"],
  14: ["Generate a fictional mini dataset of 15 transactions I can practice with.", "What are the 2 most common bank reconciliation discrepancies I should look for?", "Can you write a plain-English summary of a month's transactions for a business owner?"],

  // Week 3 — Month-End, Controls & Ethics
  15: ["Can you explain the difference between an accrual and a prepayment with examples?", "Write a prompt that reviews a list of expenses and flags likely accruals.", "What adjusting entries are most commonly missed at month end?"],
  16: ["What are the 3 steps in the AP process where human approval is non-negotiable?", "How does AI help with invoice matching in accounts payable?", "What fraud risks exist in an automated AP workflow?"],
  17: ["Can you draft a 30-day overdue payment chaser email for me to edit?", "What does an AI-assisted debtor aging report look like?", "How do I keep my payment chasers professional but firm?"],
  18: ["Write an AI prompt that checks expense claims against a policy I describe.", "What are the most common types of expense fraud in small businesses?", "What should a 5-rule expense policy for a small business include?"],
  19: ["Can you draft a 5-step AI-assisted month-end close checklist?", "Write a prompt that turns variance bullet points into a 150-word management commentary.", "What should the human review step look like in an AI-assisted close?"],
  20: ["What is segregation of duties and why does it still matter with AI?", "Can you map a purchase-to-pay process with control points at each step?", "How do I make sure AI doesn't bypass an approval gate in my workflow?"],
  21: ["Help me write my personal 5-rule AI usage policy for finance work.", "What data should I never paste into a public AI tool?", "What are the main confidentiality risks of using AI in accounting?"],

  // Week 4 — Reporting, Communication & Capstone
  22: ["Write a prompt that summarises a tax process and lists official sources to verify.", "Where does AI genuinely help with tax research vs where is it dangerous?", "What should I always check before relying on AI output for tax questions?"],
  23: ["Turn these variance bullets into a 150-word board commentary: Revenue up 15% new client, Wages up 9% two new hires, Travel down 60% no trips.", "What makes management commentary useful to a non-finance reader?", "How do I give AI the right context to write in my voice?"],
  24: ["Can you draft a monthly financial update email for a small business owner?", "How do I explain in plain English why cash dropped despite showing a profit?", "Write a paragraph summarising action items from a fictional finance meeting."],
  25: ["What are the 5 most common data quality problems in accounting systems?", "How does a messy chart of accounts affect AI output quality?", "What does good vendor master data look like vs bad?"],
  26: ["How do I calculate and interpret debtor days for a small business?", "Write a prompt that calculates gross margin and explains what it means.", "What 5 KPIs should every small business finance team track monthly?"],
  27: ["Help me build a prompt library entry for month-end variance commentary.", "What categories should my accountant prompt library cover?", "Can you give me an example of a reusable prompt for chasing overdue invoices?"],
  28: ["Help me map my 6-step AI-assisted monthly accounting workflow.", "What should my personal AI usage rules include based on what I have learned?", "Can you review my workflow and suggest one improvement for each step?"],
};

export default function DayChat({ day }: { day: DayLesson }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  // ✨ ADD THIS CODE HERE:
  // This clears the chat history every time the user switches to a new day
  useEffect(() => {
    setMessages([]); // Resets messages to an empty array
    setOpen(false);  // Optional: Closes the chat tab when switching days
  }, [day.day]);
  
  // Dynamic starters based on day
  const starters = STARTER_QUESTIONS[day.day] || ["Can you give me an example?", "How do I get started?", "Why does this skill matter?"];

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: "assistant",
        content: t("chat.welcome", { day: day.day }),
      }]);
    }
  }, [open, day.day, t]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  async function send(text?: string) {
    const userText = (text || input).trim();
    if (!userText || streaming) return;
    setInput("");

    const newMessages: Message[] = [...messages, { role: "user", content: userText }];
    setMessages(newMessages);
    setStreaming(true);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          dayContext: buildDayContext(day),
        }),
      });

      if (!response.ok || !response.body) throw new Error("API error");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        const currentText = accumulated;
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: currentText };
          return updated;
        });
      }
    } catch (err: any) {
      const errText = err?.message?.includes("401") ? t("chat.noApiKey") : t("chat.connectionError");
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: "assistant", content: errText };
        return updated;
      });
    } finally {
      setStreaming(false);
    }
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div className="chat-panel" style={{ width: '380px' }}> {/* Widened to prevent text crowding */}
      <button className="chat-toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <div className="chat-toggle-left">
          <span className="chat-icon"><Sparkles size={15} /></span>
          <div>
            <div className="chat-toggle-title" style={{ fontSize: '0.92rem' }}>{t("chat.askCoach")}</div>
            <div className="chat-toggle-sub" style={{ fontSize: '0.78rem' }}>{t("chat.getHelp", { day: day.day })}</div>
          </div>
        </div>
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {open && (
        <div className="chat-body" style={{ maxHeight: '550px' }}>
          <div className="chat-messages" id="chat-messages" style={{ fontSize: '0.88rem' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.role}`}>
                <div className="chat-avatar">
                  {msg.role === "assistant" ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div className="chat-bubble" style={{ lineHeight: '1.45', padding: '10px 14px' }}>
                  {msg.content || (streaming && i === messages.length - 1 ? <span className="typing-dots"><span>.</span><span>.</span><span>.</span></span> : "")}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {messages.length <= 1 && (
            <div className="chat-starters">
              <div className="starters-label" style={{ fontSize: '0.75rem', marginBottom: '8px' }}>{t("chat.tryAsking")}</div>
              <div className="starters-list">
                {starters.map((q, i) => (
                  <button key={i} className="starter-btn" onClick={() => send(q)} disabled={streaming} style={{ fontSize: '0.82rem', padding: '8px 12px' }}>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="chat-input-row" style={{ padding: '12px' }}>
            <textarea
              ref={inputRef}
              className="chat-input"
              style={{ 
                fontSize: '0.85rem', 
                minHeight: '42px', 
                lineHeight: '1.4',
                overflow: 'hidden', // Removes scroll arrows
                resize: 'none'      // Prevents manual resizing
              }}
              placeholder={t("chat.inputPlaceholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              rows={1}
              disabled={streaming}
            />
            <button
              className={`chat-send ${streaming ? "disabled" : ""}`}
              onClick={() => send()}
              disabled={streaming || !input.trim()}
              aria-label="Send"
              style={{ padding: '8px' }}
            >
              <Send size={16} />
            </button>
          </div>
          <div className="chat-footer-note" style={{ fontSize: '0.7rem', padding: '0 12px 12px' }}>{t("chat.footerHint")}</div>
        </div>
      )}
    </div>
  );
}
