Task 02 — Build with AI (Mini Tool) 

> App Built: Smart Quote Generator
> Type: Live Web App (HTML + CSS + JavaScript)
> AI Tool Used: ChatGPT (OpenAI)

---

How It Works

The app is built as a single `index.html` file combining structure, style, and logic.

1. Quote Database (JavaScript Array)

Quotes are stored as objects with:

* `text` → the quote
* `author` → who said it
* `mood` → category (deep / motivation / f1)
* `meaning` → simple explanation

---

2. Mood Filter System

When a user clicks a button, `setMood(mood)` runs:

* Updates the selected mood
* Resets used quotes
* Highlights active button
* Loads a new quote

---

3. Smart Random Logic (No Repeat)

The app avoids repeating quotes using an array:

* `usedIndexes` stores shown quotes
* Random index is generated using `Math.random()`
* If already used → pick again
* Resets when all quotes are shown

---

4. Display System

The selected quote is shown using:

 `document.getElementById().innerText`

 Updates quote, author, and meaning dynamically

---

App Features

| Feature         | Detail                                   |
| --------------- | ---------------------------------------- |
| Total quotes    | 10+ (expandable dataset)                 |
| Categories      | Deep (literature), Motivation, F1        |
| Smart random    | No repeats until all quotes are shown    |
| Meaning display | Each quote includes a simple explanation |
| Buttons         | Mood filters + Next Quote                |
| UI              | Clean dark theme                         |
| File type       | Single `.html` file                      |

---
 Key Concepts Used

| Concept          | Where Used                          |
| ---------------- | ----------------------------------- |
| Array of objects | Quote storage                       |
| `.filter()`      | Mood-based filtering                |
| `Math.random()`  | Random quote selection              |
| Loop + condition | Prevent repeating quotes            |
| DOM manipulation | Updating content dynamically        |
| Event handling   | Button clicks                       |
| CSS styling      | Dark theme UI                       |
| State management | Tracking current mood & used quotes |

---

Sample UI Description

* Dark background (`#0f0f0f`)
* Centered layout with minimal design
* Mood buttons at top (Deep / Motivation / F1)
* Large quote text display
* Author name below
* Meaning shown in subtle grey text
* Active button highlighted in accent color

---

Live App

> Open `index.html` in any browser — no installation required.
> Can be hosted using **GitHub Pages** for sharing.

---

Project Outcome

This project demonstrates:

* Logical thinking (non-repeating random system)
* Clean UI design principles
* JavaScript fundamentals (arrays, functions, DOM)
* Ability to build a functional mini application

---

Generated using ChatGPT | PRCBO TECH Internship — Task 02
