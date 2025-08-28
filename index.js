import "dotenv/config";
import { chromium } from "playwright";
import { Agent, run, tool } from "@openai/agents";
import { z } from "zod";

let page;

// Tools
const screenshotTool = tool({
  name: "screenshot",
  description: "Capture a screenshot of the current page (returned as base64)",
  parameters: z.object({}).strict(),
  execute: async () => {
    try {
      const buffer = await page.screenshot({ quality: 50 });
      return buffer.toString("base64");
    } catch (err) {
      return `Error taking screenshot: ${err.message}`;
    }
  },
});

const openUrlTool = tool({
  name: "open_url",
  description: "Open a webpage by URL",
  parameters: z.object({
    url: z.string().describe("The full URL, e.g. https://ui.chaicode.com/auth/signup")
  })
    .strict(),
  execute: async ({ url }) => {
    try {
      await page.goto(url, { timeout: 15000, waitUntil: "domcontentloaded" });
      return `Opened ${url}`;
    } catch (err) {
      return `Error opening ${url}: ${err.message}`;
    }
  },
});

const fillSignupFormTool = tool({
  name: "fill_signup_form",
  description: "Fill the signup form with user details",
  parameters: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    password: z.string(),
    confirmPassword: z.string(),
  }).strict(),
  execute: async ({ firstName, lastName, email, password, confirmPassword }) => {
    try {
      await page.fill("#firstName", firstName);
      await page.fill("#lastName", lastName);
      await page.fill("#email", email);
      await page.fill("#password", password);
      await page.fill("#confirmPassword", confirmPassword);
      return "Signup form filled successfully.";
    } catch (err) {
      return `Error filling signup form: ${err.message}`;
    }
  },
});

const submitSignupFormTool = tool({
  name: "submit_signup_form",
  description: "Click the Create Account button",
  parameters: z.object({}).strict(),
  execute: async () => {
    try {
      await page.click("button[type='submit']");
      await page.waitForTimeout(2000); // give time for navigation/response
      return "Clicked Create Account button.";
    } catch (err) {
      return `Error submitting form: ${err.message}`;
    }
  },
});

// Agent
const browserAgent = new Agent({
  name: "WebAutomationAgent",
  model: "gpt-4.1-mini",
  max_output_tokens: 2000,
  tools: [
    openUrlTool,
    screenshotTool,
    fillSignupFormTool,
    submitSignupFormTool,
  ],
  instructions: `
   You are a signup automation agent.
   Keep responses short. 
    Do NOT describe screenshots in detail—only confirm success/failure.
    Steps:
    1. Open https://ui.chaicode.com/auth/signup
    2. Use fill_signup_form with provided user details
    3. Use submit_signup_form to complete registration
    Always capture a screenshot before and after filling the form.
  `,
});


async function main() {
  const browser = await chromium.launch({ headless: false });
  page = await browser.newPage();

  const task = `
    Go to https://ui.chaicode.com/auth/signup
    Fill the signup form with:
      First Name = Harsh
      Last Name = Shukla
      Email = harsh@example.com
      Password = myPassword123
      Confirm Password = myPassword123
    Then click Create Account.
  `;
  try {
    const result = await run(browserAgent, task);
    console.log("Final output:", result.finalOutput);
  } catch (err) {
    console.error("Agent run failed:", err);
    await browser.close();
  } finally {
    await browser.close();
  }

}

main();
