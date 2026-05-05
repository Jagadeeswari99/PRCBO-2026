
import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyze = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": "Bearer " + import.meta.env.VITE_OPENROUTER_KEY,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "user",
              content: `Analyze this resume. Give ATS score and improvements:\n${text}`
            }
          ]
        })
      });

      const data = await res.json();
      setResult(data.choices[0].message.content);
    } catch (e) {
      setResult("Error analyzing resume");
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h1>Resume Analyzer</h1>
      <textarea
        style={{ width: "100%", height: 200 }}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Paste resume..."
      />
      <button onClick={analyze} disabled={loading}>
        {loading ? "Analyzing..." : "Analyze"}
      </button>
      <pre>{result}</pre>
    </div>
  );
}
