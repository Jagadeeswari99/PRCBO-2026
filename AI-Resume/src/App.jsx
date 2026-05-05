
import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/legacy/build/pdf";
import "./App.css";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/legacy/build/pdf.worker.min.js",
  import.meta.url
).toString();

const skillKeywords = [
  "JavaScript",
  "React",
  "Node.js",
  "Python",
  "SQL",
  "AWS",
  "Git",
  "communication",
  "teamwork",
  "project management",
  "data analysis",
  "machine learning",
  "design",
  "leadership",
  "problem solving"
];

const sectionKeywords = ["summary", "experience", "education", "skills", "projects", "certifications"];

function cleanText(text) {
  return text.replace(/\s+/g, " ").trim();
}

function formatFileSize(size) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}

function calculateSectionScores(text, foundSkills) {
  const lower = text.toLowerCase();
  const experienceMatch = /\b(experience|worked|led|managed|developed|built|delivered|achieved|project)\b/.test(lower) ? 1 : 0;
  const metricsMatch = /\b(\d+%|\d+\s+(?:years|months|weeks|days)|\d+\s+(?:x|times))\b/.test(lower) ? 1 : 0;

  return {
    skills: Math.min(100, Math.round(Math.min(foundSkills.length, 8) / 8 * 100)),
    experience: Math.min(100, Math.round(Math.min(experienceMatch * 65 + metricsMatch * 30, 100))),
    keywords: Math.min(100, Math.round(foundSkills.length / Math.max(skillKeywords.length, 1) * 100))
  };
}

async function extractTextFromPdf(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const pageTexts = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent({ normalizeWhitespace: true });
    const pageText = content.items.map((item) => item.str || item?.value || "").join(" ");
    pageTexts.push(pageText);
  }

  const extracted = cleanText(pageTexts.join(" "));
  if (!extracted) {
    throw new Error("No extractable text found in the PDF. Use a searchable PDF or paste the resume text directly.");
  }
  return extracted;
}

function estimateAtsScore(text) {
  const lower = text.toLowerCase();
  const sections = sectionKeywords.filter((keyword) => lower.includes(keyword)).length;
  const skillMatches = skillKeywords.filter((keyword) => lower.includes(keyword.toLowerCase())).length;
  const achievements = /\b(improved|increased|reduced|led|delivered|successfully|achieved)\b/.test(lower) ? 1 : 0;
  const metrics = /\b(\d+%|\d+\s+(?:years|months|weeks|days)|\d+\s+(?:x|times))\b/.test(lower) ? 1 : 0;
  const lengthBonus = Math.min(10, Math.floor(text.length / 800));

  let score = 40 + sections * 8 + Math.min(skillMatches, 10) * 4 + achievements * 5 + metrics * 5 + lengthBonus;
  if (/\b(objective|career objective)\b/.test(lower)) score -= 4;
  return Math.max(35, Math.min(100, score));
}

function generateLocalAnalysis(text) {
  const clean = cleanText(text);
  const lower = clean.toLowerCase();
  const foundSkills = skillKeywords.filter((skill) => lower.includes(skill.toLowerCase()));
  const sectionScores = calculateSectionScores(clean, foundSkills);
  const score = estimateAtsScore(clean);
  const suggestions = [];

  if (sectionKeywords.filter((keyword) => lower.includes(keyword)).length < 4) {
    suggestions.push("Add clear resume sections such as Summary, Experience, Skills, Education, and Projects.");
  }
  if (!/\b(email|@|phone|linkedin|github)\b/.test(lower)) {
    suggestions.push("Include a visible contact section with email, phone, or LinkedIn.");
  }
  if (foundSkills.length < 4) {
    suggestions.push("List more specific tools and skills relevant to your role, such as React, Node.js, SQL, or AWS.");
  }
  if (!/\b(improved|increased|reduced|led|delivered|achieved|resulted in)\b/.test(lower)) {
    suggestions.push("Use achievement statements with measurable outcomes to strengthen experience descriptions.");
  }
  if (clean.length < 700) {
    suggestions.push("Consider expanding experience details with quantifiable results and project highlights.");
  }
  if (suggestions.length === 0) {
    suggestions.push("Your resume looks solid. Focus on tailoring keywords to the job posting for higher ATS performance.");
  }

  const missingKeywords = skillKeywords.filter((skill) => !foundSkills.includes(skill)).slice(0, 6);

  return {
    source: "Local analysis",
    score,
    summary: `Found ${foundSkills.length} common skill keywords and ${Math.min(5, sectionKeywords.filter((keyword) => lower.includes(keyword)).length)} resume sections.`,
    suggestions,
    sectionScores,
    missingKeywords
  };
}

function parseOpenRouterResponse(text) {
  const trimmed = text.trim();
  let result = null;

  try {
    result = JSON.parse(trimmed);
  } catch {
    // Attempt a best-effort fallback for loosely formatted responses.
  }

  if (result && typeof result === "object") {
    const score = Number(result.ats_score ?? result.score ?? result.atsScore);
    const summary = result.summary || result.analysis || "Resume analysis summary.";
    const suggestions = Array.isArray(result.suggestions)
      ? result.suggestions.map((item) => String(item).trim()).filter(Boolean)
      : typeof result.suggestions === "string"
      ? [result.suggestions.trim()]
      : [];
    const sectionScores = result.section_scores || result.sectionScores || result.sections || null;
    const missingKeywords = Array.isArray(result.missing_keywords)
      ? result.missing_keywords.map((item) => String(item).trim()).filter(Boolean)
      : [];

    if (!Number.isNaN(score) && score >= 0 && score <= 100) {
      return {
        source: "OpenRouter AI",
        score,
        summary,
        suggestions: suggestions.length > 0 ? suggestions : [trimmed],
        sectionScores,
        missingKeywords
      };
    }
  }

  const scoreMatch = trimmed.match(/(\d{1,3})\s*(?:\/\s*100|out of 100|points|pts)?/i);
  const score = scoreMatch ? Math.min(100, Math.max(0, Number(scoreMatch[1]))) : null;
  const lines = trimmed.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const suggestions = lines.filter((line) => /suggest|missing|improv|recommend|skill/i.test(line) || /^[-*]/.test(line));
  const summary = lines.find((line) => /score|summary|analysis/i.test(line)) || trimmed;

  if (!score) return null;

  return {
    source: "OpenRouter AI",
    score,
    summary,
    suggestions: suggestions.length > 0 ? suggestions : [trimmed]
  };
}

async function analyzeWithOpenRouter(content) {
  const response = await fetch('/.netlify/functions/openrouter', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to analyze resume');
  }

  const data = await response.json();
  const rawText = data.rawText;

  const parsed = parseOpenRouterResponse(rawText);
  if (!parsed) {
    return {
      source: 'OpenRouter AI',
      score: estimateAtsScore(content),
      summary: 'Could not parse AI response cleanly; fallback heuristic analysis applied.',
      suggestions: [rawText || 'No suggestions were returned by the API.'],
      sectionScores: calculateSectionScores(content, skillKeywords.filter((skill) => content.toLowerCase().includes(skill.toLowerCase()))),
      missingKeywords: skillKeywords.filter((skill) => !content.toLowerCase().includes(skill.toLowerCase())).slice(0, 6)
    };
  }
  return parsed;
}

export default function App() {
  const [resumeText, setResumeText] = useState("");
  const [pdfName, setPdfName] = useState("");
  const [fileInfo, setFileInfo] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    if (!file.type.includes("pdf")) {
      setError("Please upload a valid PDF file.");
      return;
    }

    try {
      setLoading(true);
      const extracted = await extractTextFromPdf(file);
      setPdfName(file.name);
      setFileInfo({ name: file.name, size: file.size });
      setResumeText(extracted);
      setAnalysis(null);
      setError("");
    } catch (err) {
      setError("Unable to parse PDF. Try pasting the resume text instead.");
    } finally {
      setLoading(false);
    }
  };

  const handlePdfUpload = async (event) => {
    setError("");
    const file = event.target.files?.[0];
    await handleFile(file);
  };

  const handleDrop = async (event) => {
    event.preventDefault();
    setDragging(false);
    const file = event.dataTransfer.files?.[0];
    await handleFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragging(false);
  };

  const handleAnalyze = async () => {
    setError("");
    setAnalysis(null);
    if (!resumeText.trim()) {
      setError("Paste resume text or upload a PDF before analyzing.");
      return;
    }

    setLoading(true);
    try {
      const result = await analyzeWithOpenRouter(resumeText);
      setAnalysis(result);
    } catch (err) {
      // Fallback to local analysis if AI fails
      setAnalysis(generateLocalAnalysis(resumeText));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <div className="hero-panel">
        <div>
          <p className="eyebrow">AI Resume Analyzer</p>
          <h1>Smart resume analysis with clean feedback</h1>
          <p className="hero-copy">
            Upload a resume PDF or paste your resume text. The analyzer scores your resume and highlights opportunities to improve skills,
            layout, and ATS compatibility.
          </p>
        </div>
        <div className="card card-input">
          <div className="input-header">
            <span>Resume Input</span>
            <span className="chip">{pdfName || "Text / PDF"}</span>
          </div>
          <div
            className={`drop-zone ${dragging ? "dragging" : ""}`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="drop-icon">⤓</div>
            <div>
              <strong>Drag & drop your PDF here</strong>
              <p>or click to upload. Scanned PDFs may not extract text correctly.</p>
            </div>
            <input type="file" accept="application/pdf" onChange={handlePdfUpload} />
          </div>
          {fileInfo && (
            <div className="file-preview">
              <span>{fileInfo.name}</span>
              <span>{formatFileSize(fileInfo.size)}</span>
            </div>
          )}
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste resume text here..."
          />
          <button className="primary-button" onClick={handleAnalyze} disabled={loading}>
            {loading ? "Analyzing resume..." : "Analyze Resume"}
          </button>
          {error && <div className="error-banner">{error}</div>}
          {analysis && analysis.source === 'OpenRouter AI' ? (
            <p className="hint">Using OpenRouter AI for recommendations.</p>
          ) : (
            <p className="hint">Using local heuristic analysis.</p>
          )}
        </div>
      </div>

      <div className="results-panel">
        <div className="card card-results">
          <div className="results-header">
            <div>
              <p className="section-title">Analysis Results</p>
              <p className="subtle">ATS score, summary, and skill suggestions appear here.</p>
            </div>
            {analysis && <span className="badge">{analysis.source}</span>}
          </div>

          {analysis ? (
            <>
              <div className="score-top-row">
                <div className="score-circle-shell">
                  <div
                    className="score-circle"
                    style={{
                      background: `conic-gradient(${analysis.score >= 75 ? "#16a34a" : analysis.score >= 50 ? "#f59e0b" : "#dc2626"} ${analysis.score * 3.6}deg, #e5e7eb 0deg)`
                    }}
                  >
                    <div className="score-value">
                      <strong>{analysis.score}</strong>
                      <span>/100</span>
                    </div>
                  </div>
                </div>
                <div className="score-summary-card">
                  <p className="section-title">ATS Score</p>
                  <p className="score-summary-text">Your resume score reflects keyword match, structure, and demonstrated results.</p>
                  <div className="score-status">
                    <span className={`status-dot ${analysis.score >= 75 ? "green" : analysis.score >= 50 ? "yellow" : "red"}`} />
                    <strong>{analysis.score >= 75 ? "Strong" : analysis.score >= 50 ? "Needs improvement" : "Weak"}</strong>
                  </div>
                </div>
              </div>

              {analysis.sectionScores && (
                <div className="section-grid">
                  <div className="section-card">
                    <p>Skills</p>
                    <div className="section-bar"><div style={{ width: `${analysis.sectionScores.skills}%` }} /></div>
                    <strong>{analysis.sectionScores.skills}%</strong>
                  </div>
                  <div className="section-card">
                    <p>Experience</p>
                    <div className="section-bar"><div style={{ width: `${analysis.sectionScores.experience}%` }} /></div>
                    <strong>{analysis.sectionScores.experience}%</strong>
                  </div>
                  <div className="section-card">
                    <p>Keywords</p>
                    <div className="section-bar"><div style={{ width: `${analysis.sectionScores.keywords}%` }} /></div>
                    <strong>{analysis.sectionScores.keywords}%</strong>
                  </div>
                </div>
              )}

              {analysis.missingKeywords?.length > 0 && (
                <div className="missing-keywords">
                  <p className="section-title">Missing keywords</p>
                  <div className="tag-list">
                    {analysis.missingKeywords.map((keyword, index) => (
                      <span key={index} className="keyword-chip">❌ {keyword}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="analysis-group">
                <h2>Summary</h2>
                <p>{analysis.summary}</p>
              </div>

              <div className="suggestion-grid">
                {analysis.suggestions.map((item, index) => (
                  <div key={index} className="suggestion-card">
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>Start by uploading a PDF or pasting text, then click Analyze Resume.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
