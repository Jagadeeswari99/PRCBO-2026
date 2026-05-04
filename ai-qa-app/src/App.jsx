import { useState, useRef, useEffect } from "react";

function TypingDots() {
  return (
    <span style={{ display: "inline-flex", gap: 4, alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: "50%", background: "#64ffda",
          display: "inline-block",
          animation: `bounce 1.2s ${i * 0.2}s infinite ease-in-out`,
        }} />
      ))}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 12px #64ffda33; }
          50% { box-shadow: 0 0 28px #64ffda88; }
        }
      `}</style>
    </span>
  );
}

function Message({ role, text, isTyping }) {
  const isUser = role === "user";
  return (
    <div style={{
      display: "flex", justifyContent: isUser ? "flex-end" : "flex-start",
      marginBottom: 18, animation: "fadeSlideIn 0.35s ease both",
    }}>
      {!isUser && (
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "linear-gradient(135deg, #64ffda, #0a84ff)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, marginRight: 10, flexShrink: 0, marginTop: 4,
        }}>✦</div>
      )}
      <div style={{
        maxWidth: "75%", padding: "12px 16px",
        borderRadius: isUser ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
        background: isUser ? "linear-gradient(135deg, #0a84ff, #0060cc)" : "rgba(255,255,255,0.06)",
        border: isUser ? "none" : "1px solid rgba(100,255,218,0.15)",
        color: "#e8f4f0", fontSize: 14.5, lineHeight: 1.65,
        fontFamily: "'DM Sans', sans-serif",
        whiteSpace: "pre-wrap", wordBreak: "break-word",
        backdropFilter: isUser ? "none" : "blur(10px)",
      }}>
        {isTyping ? <TypingDots /> : text}
      </div>
    </div>
  );
}

export default function AIQAApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const askQuestion = async () => {
    const question = input.trim();
    if (!question || loading) return;

    const newMessages = [...messages, { role: "user", text: question }];
    setMessages(newMessages);
    setInput("");
    setError("");
    setLoading(true);

    const contents = newMessages.map((m) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));
const API_KEY = import.meta.env.VITE_GEMINI_KEY;
const URL = `https://openrouter.ai/api/v1/chat/completions`;

try {
  const response = await fetch(URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.0-flash-exp:free",
      messages: newMessages.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      })),
    }),
  });

  if (!response.ok) throw new Error(`API error: ${response.status}`);
  const data = await response.json();
  const answer = data.choices?.[0]?.message?.content || "No response received.";      
    } catch (err) {
      setError("Something went wrong. Check your API key in .env file.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  const isEmpty = messages.length === 0 && !loading;

  return (
    <div style={{
      minHeight: "100vh", background: "#050d12",
      display: "flex", flexDirection: "column",
      fontFamily: "'DM Sans', sans-serif",
      backgroundImage: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(10,132,255,0.15), transparent), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(100,255,218,0.07), transparent)",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #64ffda33; border-radius: 2px; }
        textarea:focus { outline: none; }
        textarea { resize: none; }
      `}</style>

      <div style={{
        padding: "20px 24px 16px",
        borderBottom: "1px solid rgba(100,255,218,0.1)",
        display: "flex", alignItems: "center", gap: 12,
        backdropFilter: "blur(20px)", background: "rgba(5,13,18,0.8)",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: "linear-gradient(135deg, #64ffda22, #0a84ff22)",
          border: "1px solid rgba(100,255,218,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, animation: "glowPulse 3s infinite",
        }}>✦</div>
        <div>
          <div style={{
            fontFamily: "'Space Mono', monospace", fontSize: 15,
            fontWeight: 700, color: "#64ffda", letterSpacing: 1,
          }}>AI Q&A App</div>
          <div style={{ fontSize: 11, color: "#4a7a6a", fontWeight: 300 }}>
            Powered by Gemini · Ask anything
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} style={{
            marginLeft: "auto", background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)", color: "#6b8a82",
            fontSize: 12, padding: "5px 12px", borderRadius: 20,
            cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
          }}>Clear</button>
        )}
      </div>

      <div style={{
        flex: 1, overflowY: "auto", padding: "24px 20px",
        maxWidth: 720, width: "100%", margin: "0 auto",
      }}>
        {isEmpty && (
          <div style={{
            textAlign: "center", paddingTop: "15vh",
            color: "#2a5a4a", animation: "fadeSlideIn 0.6s ease both",
          }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>✦</div>
            <div style={{
              fontFamily: "'Space Mono', monospace", fontSize: 20,
              color: "#64ffda", marginBottom: 8, fontWeight: 700,
            }}>What do you want to know?</div>
            <div style={{ fontSize: 14, color: "#3a6a5a", lineHeight: 1.7 }}>
              Type your question and press <strong style={{ color: "#64ffda88" }}>Ask</strong> or hit{" "}
              <strong style={{ color: "#64ffda88" }}>Enter</strong>
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <Message key={i} role={msg.role} text={msg.text} />
        ))}

        {loading && <Message role="assistant" text="" isTyping />}

        {error && (
          <div style={{
            textAlign: "center", color: "#ff6b6b", fontSize: 13,
            padding: "10px", background: "rgba(255,107,107,0.08)",
            borderRadius: 10, border: "1px solid rgba(255,107,107,0.2)", marginTop: 8,
          }}>{error}</div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{
        padding: "16px 20px 24px",
        backdropFilter: "blur(20px)", background: "rgba(5,13,18,0.9)",
        borderTop: "1px solid rgba(100,255,218,0.08)",
      }}>
        <div style={{
          maxWidth: 720, margin: "0 auto",
          display: "flex", gap: 10, alignItems: "flex-end",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(100,255,218,0.2)",
          borderRadius: 16, padding: "10px 14px",
        }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            rows={1}
            style={{
              flex: 1, background: "transparent", border: "none",
              color: "#d4ede6", fontSize: 14.5,
              fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6,
              maxHeight: 120, overflowY: "auto",
            }}
            onInput={(e) => {
              e.target.style.height = "auto";
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
            }}
          />
          <button
            onClick={askQuestion}
            disabled={!input.trim() || loading}
            style={{
              background: input.trim() && !loading
                ? "linear-gradient(135deg, #64ffda, #0a84ff)"
                : "rgba(255,255,255,0.06)",
              border: "none", borderRadius: 10,
              width: 38, height: 38,
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, flexShrink: 0, transition: "all 0.2s ease",
              color: input.trim() && !loading ? "#050d12" : "#3a6a5a",
            }}
          >↑</button>
        </div>
        <div style={{
          textAlign: "center", fontSize: 11, color: "#2a4a3a",
          marginTop: 10, fontFamily: "'Space Mono', monospace",
        }}>
          Enter to send · Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}