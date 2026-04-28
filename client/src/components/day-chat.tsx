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
  1: ["Can you show me an example conversation with ChatGPT?", "What's the difference between ChatGPT and Claude?", "How do I sign up for ChatGPT for free?"],
  2: ["Can you show me an example of a good vs bad prompt?", "What does 'role + format' mean in a prompt?", "Give me a prompt template I can use for Instagram captions"],
  3: ["Can you draft a social post example for a coffee shop?", "How do I add my own voice to AI-written text?", "What's the difference between ChatGPT and Notion AI?"],
  4: ["Walk me through Canva's interface step by step", "What's the best Canva template for Instagram posts?", "How do I export from Canva as a PNG?"],
  5: ["Show me an example of a 3-color palette for a bakery brand", "What's a good font pair for a professional service business?", "How does Coolors.co work?"],
  6: ["Write me an example AI image prompt for a calm nature background", "What does 'photorealistic style' mean in an image prompt?", "How is Adobe Firefly different from Canva AI?"],
  7: ["Can you give me an example Instagram caption for a pet groomer?", "What should a social media starter pack include?", "How do I ZIP files to send to a client?"],
  8: ["Show me what makes a good YouTube thumbnail with an example", "What size should a YouTube thumbnail be?", "How do I make text stand out on a thumbnail?"],
  9: ["How does background removal work in Canva?", "When would a client need background removal done?", "What's the difference between Remove.bg and Canva's tool?"],
  10: ["What does a simple brand kit document look like?", "How do I find the hex code for a color?", "Can you give me an example brand kit for a yoga studio?"],
  11: ["How do I structure a 10-slide presentation?", "Can you outline a presentation on 'How AI helps small businesses'?", "What's the 'one idea per slide' rule?"],
  12: ["What is Canva Magic Design and how does it work?", "Should I use AI slides or design from scratch for a client?", "Show me a before/after example of AI slide improvement"],
  13: ["What makes a logo simple and effective?", "Give me an example logo brief I could give to Adobe Firefly", "What formats do clients usually need for logos?"],
  14: ["What should a creator media kit include?", "Can you write a sample bio for a fictional YouTube creator?", "How many pages should a media kit be?"],
  15: ["Can you explain a Zapier trigger vs action with an example?", "What's the difference between Zapier and Make?", "Give me 3 automations a VA could sell to clients"],
  16: ["Walk me through setting up this Zap step by step", "What is a Gmail label and how do I create one?", "What else could I log to a Google Sheet automatically?"],
  17: ["How do I set up a content calendar in Buffer?", "Show me a sample week of scheduled posts for a bakery", "What's the best posting schedule for Instagram?"],
  18: ["Can you write a target audience persona for a fitness coach?", "Give me 10 content ideas for a pet products business", "How do I verify if AI research facts are accurate?"],
  19: ["Can you show me a simple HTML page example?", "What's the difference between HTML, CSS, and JavaScript?", "Why would a VA need to know basic coding?"],
  20: ["Write me a simple HTML business card for a fictional VA", "What common website fixes do clients need help with?", "Show me how to change a button color with CSS"],
  21: ["Write a welcome email template for a new coaching client", "How do I test a Zapier workflow end-to-end?", "What should a client intake form ask for?"],
  22: ["Can you give me an example client brief and show me the questions to ask?", "What's the most common mistake VAs make with client briefs?", "How do I write a professional question to a client?"],
  23: ["Write 2 Instagram captions about plant care tips", "How do I stay consistent with a client's brand voice?", "What makes a social media post 'thumb-stopping'?"],
  24: ["When should I use PNG vs PDF for a client?", "What does 300dpi mean and why does it matter for print?", "Can you explain what an animated MP4 export is used for?"],
  25: ["What's the best free tool to upscale a blurry photo?", "How much better does AI upscaling actually make an image?", "When would a client need image enhancement?"],
  26: ["Help me write a service description for social media graphics", "What should I charge as a beginner VA for Canva graphics?", "How many services should I offer when starting out?"],
  27: ["Can you write a 3-sentence VA bio I can edit?", "What should I put in my portfolio if I have no real clients?", "How do I present mock projects professionally?"],
  28: ["Help me write a welcome email for the fictional yoga client", "What should a full client handoff folder include?", "Give me feedback on how to present this project to a client"],
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
