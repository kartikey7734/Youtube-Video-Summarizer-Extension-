# Launch & Marketing Guide for YouTube Summarizer

Congratulations on building your extension! Here is your roadmap to taking it from a local project to a successful public tool.

## Phase 1: Launching the Landing Page
The landing page we built is your "Home Base". You should host it on a public domain so users can find information and the install link.

### 1. Choose a Hosting Provider
Since this is a static site built with Vite, you can host it for free on:
- **Vercel** (Highly Recommended: Just connect your GitHub repo)
- **Netlify**
- **GitHub Pages** (Free, easy to set up via GitHub Actions)

### 2. Get a Domain
- Buy a domain like `tubesummarizer.com` or `getvideoai.com`.
- Point the DNS as instructed by your hosting provider.

---

## Phase 2: Launching to the Chrome Web Store

### 1. Developer Account
- Go to the [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole).
- Sign in with a Google Account.
- Pay the one-time $5 developer registration fee.

### 2. Zip your Extension
- Run `npm run build`.
- Zip the contents of your build output (usually a folder where `manifest.json` and bundled JS reside). *Note: Ensure your `vite.config.ts` preserves the structure required by manifest.json.*

### 3. Submit for Review
- Upload your zip file.
- Provide:
  - **Icons**: 16x16, 48x48, 128x128 (already in your project).
  - **Screenshots**: At least one 1280x800 or 640x400 image.
  - **Description**: Use the copy from our landing page to highlight key benefits.
  - **Privacy Policy**: Required by Google. You can generate a simple one online.

---

## Phase 3: Finding Your First Users (The "Hustle")

### 1. Leverage Communities
- **Product Hunt**: Launch on a Tuesday or Wednesday. Prepare a nice "hunt" package with a video demo.
- **Reddit**: Post in subreddits like `r/chrome_extensions`, `r/productivity`, `r/learning`, and `r/LifeProTips`. Be helpful, not spammy.
- **Indie Hackers**: Share your journey of building the tool.

### 2. Content Marketing (SEO)
- **YouTube Itself**: Create a short video showing how much time you save using the extension. Use keywords like "how to summarize youtube videos faster".
- **Blog Posts**: Write articles like "5 Ways to Learn from YouTube 10x Faster" and mention your tool.

### 3. Cold Outreach / Influencers
- Find productivity YouTubers or tech reviewers on Twitter/X.
- Send them a polite DM: "Hey, I built this free tool that summarizes videos using Gemini. Thought your audience might find it useful for research."

---

## Phase 4: Retention & Feedback loop
- **User Feedback**: Add a "Send Feedback" link in your popup.
- **Iterate**: Watch how people use it. If they ask for "Save as PDF", build that next!
- **Gemini Usage**: Monitor your API costs. If you get thousands of users, consider a "Bring your own Key" model (which we already implemented) or a premium tier.

**Good luck! You've built a powerful tool. Now go show it to the world.**
