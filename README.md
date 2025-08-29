# 🤖 Browser Automation Agent

This project demonstrates a **tiny browser automation agent** built using the [OpenAI Agent SDK](https://github.com/openai) and [Playwright](https://playwright.dev/).  
The agent can **open a signup page, fill in the form details, and submit the form**, while also capturing **snapshots before and after filling** the form for validation.

[Demo youtube link](https://youtu.be/84MUKWFxAec)

---

## ✨ Features
- Launches a Chromium browser via Playwright.
- Navigates to the signup page (`https://ui.chaicode.com/auth/signup`).
- Automatically fills in:
  - First Name
  - Last Name
  - Email
  - Password + Confirm Password
- Submits the form by clicking **Create Account**.
- Captures screenshots before and after filling the form.

---

## 🛠️ Tech Stack
- **Playwright** → Chromium browser automation.  
- **OpenAI Agent SDK** → Tool orchestration and task execution.  
- **Node.js** with ES Modules + Zod (for schema validation).  

---

## 📂 Project Structure
```bash
├── index.js # Main entry point (agent + tools + runner)
├── package.json # Dependencies
└── README.md # Project docs
```

---

## ⚡ Setup

1. **Clone the repo**:
   ```bash
   git clone https://github.com/Harshof16/WebAutomation-Agent.git
   cd browser-automation-agent
   ```
2. **Install dependencies**:
```bash
npm install
```
3. **Set environment variables**:
Create a .env file with your OpenAI API key:
```bash
OPENAI_API_KEY=your_api_key_here
```
4. **Run the agent**:
```bash
node index.js
```
---

## 🚀 Usage

The agent is instructed with tasks like:
```bash
Go to https://ui.chaicode.com/auth/signup
Fill the signup form with:
  First Name = Harsh
  Last Name = Shukla
  Email = harsh@example.com
  Password = myPassword123
  Confirm Password = myPassword123
Then click Create Account.
```
Screenshots are captured automatically before and after filling.

---

## ⚠️ Notes

- Browser is launched in non-headless mode for visibility.
- Errors like rate limits (429) may occur with large context requests — retry after a short delay.
- Tools implemented:
   - open_url → open a webpage
   - fill_signup_form → fill the form
   - submit_signup_f orm → submit the form
   - screenshot → capture validation snapshots

