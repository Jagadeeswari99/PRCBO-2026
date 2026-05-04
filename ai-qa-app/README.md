```bash
cat > README.md << 'EOF'
# 🤖 AI Q&A App — Task 3: API + AI Integration Basics

A conversational AI Question & Answer app built with React + Vite, powered by OpenRouter API.

## 🚀 Live Demo

> Run locally or via GitHub Codespaces

## 📌 Task Overview

**Task:** Learn how to use APIs by building a small AI-powered app.
**Goal:** User types a question → Click Ask → AI returns the answer

## 🛠️ Tech Stack

- **Frontend:** React 19 + Vite 8
- **AI API:** OpenRouter API (free tier)
- **Model:** openai/gpt-oss-20b:free
- **Styling:** Inline CSS with custom animations

## ✨ Features

- 💬 Multi-turn conversation (remembers chat history)
- ⌨️ Typing animation while AI is thinking
- ↑ Send with Enter key or click button
- 🗑️ Clear chat button
- 📱 Responsive design
- 🌙 Dark theme UI

## ⚙️ How It Works

```
User types question → React state updates → fetch() calls OpenRouter API → AI response displayed
```

## 🔧 Setup & Installation

### 1. Clone the repo
```bash
git clone https://github.com/Jagadeeswari99/PRCBO-2026.git
cd PRCBO-2026/ai-qa-app
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create .env file
```bash
touch .env
```
Add your OpenRouter API key:
```
VITE_GEMINI_KEY=your_openrouter_api_key_here
```
Get a free key at: https://openrouter.ai

### 4. Run the app
```bash
npm run dev
```
Open http://localhost:5173 in your browser.

## 📁 Project Structure

```
ai-qa-app/
├── src/
│   ├── App.jsx        # Main component with AI logic
│   ├── main.jsx       # React entry point
│   └── index.css      # Global styles
├── .env               # API key (not committed)
├── .gitignore         # Ignores .env
├── index.html
└── package.json
```

## 🔑 API Integration

Uses OpenRouter's chat completions endpoint:

```js
const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + API_KEY,
  },
  body: JSON.stringify({
    model: "openai/gpt-oss-20b:free",
    messages: conversationHistory
  }),
});
```
## 🛡️ Security

- API key stored in `.env` file
- `.env` is listed in `.gitignore` — never pushed to GitHub
- Use `import.meta.env.VITE_GEMINI_KEY` to access safely in Vite

---

*Submitted for PRCBO-2026 Task 3: API + AI Integration Basics*
```

Then push it to GitHub:
```bash
git add README.md
git commit -m "Add README for Task 3"
git push origin AI
```
