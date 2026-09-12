# AI Buddy — deploying on Vercel

This folder is a complete, ready-to-deploy project:

```
ai-buddy-vercel/
├── index.html      ← the chatbot UI
├── api/chat.js     ← serverless function that calls Claude (holds your API key)
├── package.json
└── README.md
```

## 1. Get an Anthropic API key
Sign up / log in at https://console.anthropic.com, go to **API Keys**, and create one.
Keep it secret — never paste it into `index.html` or any front-end file.

## 2. Deploy

**Option A — Vercel CLI (fastest)**
```bash
npm install -g vercel
cd ai-buddy-vercel
vercel
```
Follow the prompts (it'll ask to link/create a project). When it finishes, it gives you a live URL.

**Option B — GitHub + Vercel dashboard**
1. Push this folder to a new GitHub repository.
2. Go to https://vercel.com/new, import that repository.
3. Click **Deploy** (no build settings needed — it's static + one function).

## 3. Add your API key as an environment variable
In the Vercel dashboard: **Project → Settings → Environment Variables**
- Name: `ANTHROPIC_API_KEY`
- Value: *(paste your key)*
- Environment: Production (and Preview, if you want)

Then redeploy (**Deployments → ⋯ → Redeploy**) so the function picks up the variable.

## 4. Done
Open your `*.vercel.app` URL — AI Buddy will now answer for real, with your API key
safely kept server-side inside `api/chat.js`. Nobody viewing the page can see it.

## Notes
- The model used is `claude-sonnet-5`. You can swap it in `api/chat.js` for a different one.
- You're billed per Anthropic's API pricing for usage on your key — see https://www.anthropic.com/pricing for current rates.
- If replies stop working after deploying, check **Vercel → your project → Logs** for the error message.
