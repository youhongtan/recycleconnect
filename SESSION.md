# Session Summary — July 27, 2026

## What's Done
- Base44 removed, migrated to Supabase + Vite standalone
- Auth: Supabase Google OAuth working, admin role fixed (recursive RLS → `is_admin()` SECURITY DEFINER function)
- AI: Groq primary (`llama-3.1-8b-instant`), Gemini fallback, complexity routing
- Scan: Gemini vision (Groq can't see images)
- All pages rewritten for Supabase (Settings, Profile, CheckIn, Finder, Rewards, Challenges, Leaderboard, Contact, Admin)
- Pushed to GitHub: https://github.com/youhongtan/recycleconnect

## Next Step (Unfinished)
- Deploy to Vercel:
  1. Go to https://vercel.com/new, import `youhongtan/recycleconnect`
  2. Add env vars:
     - `VITE_SUPABASE_URL` = `https://qowosrlcakkznvzryfpj.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFvd29zcmxjYWtrem52enJ5ZnBqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUxMzM3MjYsImV4cCI6MjEwMDcwOTcyNn0.zNd3fb1zdRN3aBCPzC0bEyUkJuNeMQMstUG4QLr5NoY`
     - `VITE_GROQ_API_KEY` = `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`
     - `VITE_GEMINI_API_KEY` = (your Gemini key)
  3. Add Vercel domain to Supabase Auth → Settings → URL configuration

## Key Files
- `vite.config.js` — dev API middleware (Groq + Gemini)
- `api/chat.js` — Vercel serverless chat function
- `api/scan.js` — Vercel serverless scan function
- `vercel.json` — SPA rewrites
- `src/lib/AuthContext.jsx` — Supabase auth + role
- `supabase/migration.sql` — DB schema (already ran)

## User Accounts
- Admin: youhong.tyh@gmail.com (UUID: 6ba6e809-cfc7-46f3-86ca-2ccf3b85e053)

## Commands
- Dev: `npm run dev` (starts on localhost:5173)
- Build: `npm run build`
- To start server: `Start-Process powershell -ArgumentList "-Command npm run dev" -WorkingDirectory "C:\Users\Aloysius Tan\Desktop\RecycleConnect\recycle-connect" -PassThru -NoNewWindow`
